"use client";

import { cn } from "@/lib/utils/cn";

interface TabsProps<T extends string> {
  value: T;
  onValueChange: (value: T) => void;
  items: { value: T; label: string; count?: number }[];
  className?: string;
}

export function Tabs<T extends string>({ value, onValueChange, items, className }: TabsProps<T>) {
  return (
    <div
      className={cn(
        "inline-grid rounded-lg border border-white/10 bg-black/30 p-1",
        className,
      )}
      style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
    >
      {items.map((item) => (
        <button
          className={cn(
            "h-8 rounded-md px-3 text-xs font-medium text-zinc-400 transition hover:text-zinc-100",
            item.value === value && "bg-white/10 text-white shadow-inner",
          )}
          key={item.value}
          onClick={() => onValueChange(item.value)}
          type="button"
        >
          <span>{item.label}</span>
          {typeof item.count === "number" ? (
            <span className="ml-2 font-mono text-[10px] text-cyan-200">{item.count}</span>
          ) : null}
        </button>
      ))}
    </div>
  );
}
