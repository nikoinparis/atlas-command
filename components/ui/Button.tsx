import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
}

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "border-cyan-300/40 bg-cyan-300/15 text-cyan-50 shadow-[0_0_24px_rgba(34,211,238,0.16)] hover:bg-cyan-300/25",
  secondary:
    "border-white/10 bg-white/[0.07] text-zinc-100 hover:border-white/20 hover:bg-white/[0.11]",
  ghost: "border-transparent bg-transparent text-zinc-300 hover:bg-white/[0.07] hover:text-white",
  danger:
    "border-rose-300/35 bg-rose-500/15 text-rose-50 hover:bg-rose-500/25",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  icon: "h-9 w-9 p-0",
};

export function Button({
  className,
  variant = "secondary",
  size = "md",
  icon,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-md border font-medium transition focus:outline-none focus:ring-2 focus:ring-cyan-300/50 disabled:cursor-not-allowed disabled:opacity-50",
        sizeClass[size],
        variantClass[variant],
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
