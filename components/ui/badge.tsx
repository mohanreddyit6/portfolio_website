import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline";
}

const variants: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default:
    "bg-slate-900 text-white dark:bg-white dark:text-slate-900",
  secondary:
    "bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-white",
  outline:
    "border border-slate-300 dark:border-slate-700 text-current",
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs",
        variants[variant],
        className
      )}
      {...props}
    />
  )
);
Badge.displayName = "Badge";
