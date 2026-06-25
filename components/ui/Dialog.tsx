"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

interface DialogProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  className?: string;
}

export function Dialog({ open, title, children, onClose, className }: DialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
      <div
        className={cn(
          "w-full max-w-xl rounded-lg border border-white/10 bg-zinc-950 p-5 shadow-2xl",
          className,
        )}
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-base font-semibold text-white">{title}</h2>
          <Button aria-label="Close dialog" icon={<X size={16} />} onClick={onClose} size="icon" />
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
