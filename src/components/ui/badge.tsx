import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "muted";
}

function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center text-[10px] font-medium tracking-wider uppercase",
        {
          "text-text-secondary": variant === "default",
          "text-text-muted": variant === "muted",
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export { Badge };
