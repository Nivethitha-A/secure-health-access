import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const riskBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider",
  {
    variants: {
      level: {
        low: "bg-success/15 text-success border border-success/20",
        medium: "bg-warning/15 text-warning border border-warning/20",
        high: "bg-destructive/15 text-destructive border border-destructive/20 animate-pulse-red",
      },
    },
    defaultVariants: {
      level: "low",
    },
  }
);

interface RiskBadgeProps extends VariantProps<typeof riskBadgeVariants> {
  className?: string;
}

export function RiskBadge({ level, className }: RiskBadgeProps) {
  return (
    <span className={cn(riskBadgeVariants({ level }), className)}>
      <span className={cn(
        "h-1.5 w-1.5 rounded-full",
        level === 'low' && "bg-success",
        level === 'medium' && "bg-warning",
        level === 'high' && "bg-destructive"
      )} />
      {level}
    </span>
  );
}
