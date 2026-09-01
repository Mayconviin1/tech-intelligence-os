"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full h-10 px-4 text-sm",
          "bg-bg-surface border border-border-subtle rounded-sm",
          "text-text-primary placeholder:text-text-muted",
          "transition-all duration-200 ease-out",
          "focus:outline-none focus:ring-2 focus:ring-border-default focus:border-border-default",
          "hover:border-border-default",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
