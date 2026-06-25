import type { ReactNode } from "react";
import { BottomDock } from "@/components/layout/BottomDock";

interface PageShellProps {
  title: string;
  eyebrow: string;
  children: ReactNode;
}

export function PageShell({ title, eyebrow, children }: PageShellProps) {
  return (
    <main className="min-h-screen bg-[#07111b] pb-24 text-white">
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(140deg,#06111d_0%,#0c1c22_46%,#101116_100%)]" />
      <div className="mx-auto min-h-screen max-w-[1680px] p-4">
        <section className="min-w-0">
          <div className="mb-4 rounded-lg border border-white/10 bg-zinc-950/65 p-5 backdrop-blur-md">
            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-cyan-200/70">
              {eyebrow}
            </div>
            <h1 className="mt-1 text-2xl font-semibold tracking-wide text-white">{title}</h1>
          </div>
          {children}
        </section>
      </div>
      <BottomDock />
    </main>
  );
}
