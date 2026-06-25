import { cn } from "@/lib/utils/cn";

interface ProgressProps {
  value: number;
  className?: string;
  indicatorClassName?: string;
}

export function Progress({ value, className, indicatorClassName }: ProgressProps) {
  const safeValue = Math.min(100, Math.max(0, value));

  return (
    <div
      className={cn("h-2 overflow-hidden rounded-full bg-white/10 ring-1 ring-white/10", className)}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={safeValue}
      role="progressbar"
    >
      <div
        className={cn("h-full rounded-full bg-cyan-300 transition-all", indicatorClassName)}
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}
