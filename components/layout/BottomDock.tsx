"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  CheckSquare,
  Coins,
  Home,
  Landmark,
  LayoutDashboard,
  Library,
  ListTodo,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/base", label: "Base", icon: Home },
  { href: "/buildings", label: "Buildings", icon: Landmark },
  { href: "/agents", label: "Agents", icon: Bot },
  { href: "/tasks", label: "Tasks", icon: ListTodo },
  { href: "/approvals", label: "Approvals", icon: CheckSquare },
  { href: "/treasury", label: "Treasury", icon: Coins },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/docs", label: "Docs", icon: Library },
];

export function BottomDock() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-3 bottom-4 z-40 mx-auto w-[min(calc(100%-1.5rem),980px)] overflow-x-auto rounded-xl border border-white/[0.12] bg-zinc-950/[0.58] p-2 shadow-[0_18px_70px_rgba(0,0,0,0.42)] backdrop-blur-2xl">
      <div className="flex min-w-max gap-1 md:grid md:min-w-0 md:grid-cols-9">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href === "/dashboard" && pathname === "/");

          return (
            <Link
              className={cn(
                "group flex h-11 w-20 min-w-0 flex-col items-center justify-center gap-1 rounded-lg px-1 text-[10px] font-medium text-zinc-400 transition hover:bg-white/[0.07] hover:text-white md:h-12 md:w-auto",
                active &&
                  "bg-cyan-300/[0.12] text-cyan-50 shadow-[inset_0_0_0_1px_rgba(103,232,249,0.25)]",
              )}
              href={item.href}
              key={item.href}
            >
              <Icon className="shrink-0" size={15} />
              <span className="truncate leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
