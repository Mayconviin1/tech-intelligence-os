"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-default focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          {
            "bg-text-primary text-bg-primary hover:bg-text-secondary active:scale-[0.98]": variant === "primary",
            "bg-transparent border border-border-default text-text-primary hover:bg-bg-surface active:scale-[0.98]": variant === "secondary",
            "bg-transparent text-text-primary hover:bg-bg-surface active:scale-[0.98]": variant === "ghost",
          },
          {
            "h-8 px-3 text-xs gap-1.5": size === "sm",
            "h-10 px-4 text-sm gap-2": size === "md",
            "h-12 px-6 text-base gap-2.5": size === "lg",
          },
          "rounded-pill",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
