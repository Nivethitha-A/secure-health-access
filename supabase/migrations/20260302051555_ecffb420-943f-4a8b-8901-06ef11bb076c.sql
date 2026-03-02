
-- Enable pgcrypto for SHA-256 hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'doctor', 'nurse', 'patient');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- has_role helper (security definer to avoid RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- get_user_role helper
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- Patient consents table
CREATE TABLE public.patient_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  doctor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  doctor_name TEXT NOT NULL,
  specialty TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'expired')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expiry_date DATE NOT NULL,
  revoked_at TIMESTAMPTZ
);

ALTER TABLE public.patient_consents ENABLE ROW LEVEL SECURITY;

-- Emergency access table
CREATE TABLE public.emergency_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  doctor_name TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  patient_name TEXT NOT NULL,
  justification TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL DEFAULT now(),
  expiry_time TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '30 minutes'),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired'))
);

ALTER TABLE public.emergency_access ENABLE ROW LEVEL SECURITY;

-- Audit logs table (immutable)
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  user_name TEXT NOT NULL,
  role TEXT NOT NULL,
  action TEXT NOT NULL,
  patient_id TEXT,
  patient_name TEXT,
  risk_level TEXT NOT NULL DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high')),
  justification TEXT,
  ip_address TEXT,
  device_id TEXT,
  previous_hash TEXT NOT NULL DEFAULT '0000',
  current_hash TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- SHA-256 hash chaining function
CREATE OR REPLACE FUNCTION public.compute_audit_hash()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  prev_hash TEXT;
  data_string TEXT;
BEGIN
  -- Get previous hash
  SELECT COALESCE(
    (SELECT current_hash FROM public.audit_logs ORDER BY created_at DESC LIMIT 1),
    '0000'
  ) INTO prev_hash;
  
  NEW.previous_hash := prev_hash;
  
  -- Build data string from log fields
  data_string := COALESCE(NEW.user_id::text, '') ||
                 COALESCE(NEW.user_name, '') ||
                 COALESCE(NEW.role, '') ||
                 COALESCE(NEW.action, '') ||
                 COALESCE(NEW.patient_id, '') ||
                 COALESCE(NEW.risk_level, '') ||
                 COALESCE(NEW.justification, '') ||
                 COALESCE(NEW.ip_address, '') ||
                 COALESCE(NEW.device_id, '') ||
                 COALESCE(NEW.created_at::text, '') ||
                 prev_hash;
  
  NEW.current_hash := encode(digest(data_string, 'sha256'), 'hex');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_compute_audit_hash
  BEFORE INSERT ON public.audit_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.compute_audit_hash();

-- Prevent audit log modification
CREATE OR REPLACE FUNCTION public.prevent_audit_modification()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'Audit logs cannot be modified or deleted';
END;
$$;

CREATE TRIGGER prevent_audit_update
  BEFORE UPDATE ON public.audit_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_audit_modification();

CREATE TRIGGER prevent_audit_delete
  BEFORE DELETE ON public.audit_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_audit_modification();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    NEW.email
  );
  
  -- Default role is 'patient'
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'patient'));
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Verify audit chain integrity function
CREATE OR REPLACE FUNCTION public.verify_audit_chain()
RETURNS TABLE(is_valid BOOLEAN, broken_at UUID)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  rec RECORD;
  expected_hash TEXT;
  prev_hash TEXT := '0000';
  data_string TEXT;
BEGIN
  FOR rec IN SELECT * FROM public.audit_logs ORDER BY created_at ASC LOOP
    data_string := COALESCE(rec.user_id::text, '') ||
                   COALESCE(rec.user_name, '') ||
                   COALESCE(rec.role, '') ||
                   COALESCE(rec.action, '') ||
                   COALESCE(rec.patient_id, '') ||
                   COALESCE(rec.risk_level, '') ||
                   COALESCE(rec.justification, '') ||
                   COALESCE(rec.ip_address, '') ||
                   COALESCE(rec.device_id, '') ||
                   COALESCE(rec.created_at::text, '') ||
                   prev_hash;
    
    expected_hash := encode(digest(data_string, 'sha256'), 'hex');
    
    IF expected_hash != rec.current_hash THEN
      RETURN QUERY SELECT false, rec.id;
      RETURN;
    END IF;
    
    prev_hash := rec.current_hash;
  END LOOP;
  
  RETURN QUERY SELECT true, NULL::UUID;
END;
$$;

-- ========== RLS POLICIES ==========

-- Profiles: users see own, admins see all
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- User roles: users see own role, admins see all
CREATE POLICY "Users can view own role"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Patient consents: patients manage own, doctors see their consents
CREATE POLICY "Patients manage own consents"
  ON public.patient_consents FOR ALL
  TO authenticated
  USING (patient_id = auth.uid());

CREATE POLICY "Doctors see their consents"
  ON public.patient_consents FOR SELECT
  TO authenticated
  USING (doctor_id = auth.uid());

CREATE POLICY "Admins see all consents"
  ON public.patient_consents FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Emergency access: doctors create, admins/patients view
CREATE POLICY "Doctors create emergency access"
  ON public.emergency_access FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'doctor'));

CREATE POLICY "Doctors view own emergency access"
  ON public.emergency_access FOR SELECT
  TO authenticated
  USING (doctor_id = auth.uid());

CREATE POLICY "Admins view all emergency access"
  ON public.emergency_access FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Audit logs: insert for authenticated, select for admins
CREATE POLICY "Authenticated users can insert audit logs"
  ON public.audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view audit logs"
  ON public.audit_logs FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view own audit logs"
  ON public.audit_logs FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());
