import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

type ButtonBaseProps = React.ComponentPropsWithoutRef<"button">;

export interface ButtonProps extends ButtonBaseProps {
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "icon";
  asChild?: boolean;
}

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default:
    "bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-90",
  outline:
    "border border-slate-300 dark:border-slate-700 hover:bg-slate-100/50 dark:hover:bg-slate-800/50",
  secondary:
    "bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-white hover:opacity-90",
  ghost: "hover:bg-slate-100/70 dark:hover:bg-slate-800/70",
};

const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  default: "h-11 px-4",
  icon: "h-11 w-11 p-0",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...rest }, ref) => {
    const Comp: React.ElementType = asChild ? Slot : "button";
    const classes = cn(
      // base
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium leading-none",
      "transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      variants[variant],
      sizes[size],
      className
    );

    if (asChild) {
      // Don’t forward a button ref to arbitrary child (e.g., <a>)
      return <Comp className={classes} {...rest} />;
    }

    // as a real <button>, forward the ref with correct type
    return (
      <Comp
        className={classes}
        ref={ref}
        {...(rest as React.ComponentPropsWithoutRef<"button">)}
      />
    );
  }
);
Button.displayName = "Button";
