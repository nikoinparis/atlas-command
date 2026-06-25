"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  CheckSquare,
  Coins,
  Home,
  Landmark,
  Library,
  ListTodo,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { href: "/base", label: "Base", icon: Home },
  { href: "/buildings", label: "Buildings", icon: Landmark },
  { href: "/agents", label: "Agents", icon: Bot },
  { href: "/tasks", label: "Tasks", icon: ListTodo },
  { href: "/approvals", label: "Approvals", icon: CheckSquare },
  { href: "/treasury", label: "Treasury", icon: Coins },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/docs", label: "Docs", icon: Library },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="rounded-lg border border-white/10 bg-zinc-950/65 p-2 backdrop-blur-md">
      <div className="grid grid-cols-3 gap-1 xl:grid-cols-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (item.href === "/base" && (pathname === "/" || pathname === "/dashboard"));

          return (
            <Link
              className={cn(
                "flex h-10 items-center justify-center gap-2 rounded-md px-3 text-xs font-medium text-zinc-400 transition hover:bg-white/[0.07] hover:text-white xl:justify-start",
                active && "bg-cyan-300/[0.10] text-cyan-50 ring-1 ring-cyan-300/25",
              )}
              href={item.href}
              key={item.href}
            >
              <Icon size={15} />
              <span className="hidden sm:inline">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
