import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "bg-bg-surface animate-shimmer rounded-sm",
        "bg-[length:200%_100%] bg-gradient-to-r from-transparent via-bg-surface-hover to-transparent",
        className
      )}
    />
  );
}

export { Skeleton };
