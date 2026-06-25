import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border border-white/10 bg-zinc-950/70 shadow-[0_16px_60px_rgba(0,0,0,0.28)] backdrop-blur-md",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  title,
  eyebrow,
  action,
}: HTMLAttributes<HTMLDivElement> & {
  title: ReactNode;
  eyebrow?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div className="min-w-0">
        {eyebrow ? (
          <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.12em] text-cyan-200/70">
            {eyebrow}
          </div>
        ) : null}
        <h2 className="text-sm font-semibold text-zinc-50">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-4", className)} {...props} />;
}
