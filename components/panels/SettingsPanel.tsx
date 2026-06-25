"use client";

import { useState } from "react";
import { KeyRound, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { treasuryRecord } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils/format";

export function SettingsPanel() {
  const [monthlyBudget, setMonthlyBudget] = useState(treasuryRecord.monthlyAIBudget);
  const [dailyBudget, setDailyBudget] = useState(treasuryRecord.dailyAIBudget);
  const [taskCap, setTaskCap] = useState(treasuryRecord.maxCostPerTask);
  const [runs, setRuns] = useState(treasuryRecord.maxRunsPerTask);
  const [approvalThreshold, setApprovalThreshold] = useState(treasuryRecord.requireApprovalAbove);
  const [approvalRequired, setApprovalRequired] = useState(true);

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
      <Card className="p-4">
        <CardHeader eyebrow="Controls" title="Budget And Safety" action={<SlidersHorizontal className="text-cyan-200" size={18} />} />
        <CardBody className="space-y-5">
          <SettingRange
            label="Monthly AI budget"
            max={250}
            min={0}
            onChange={setMonthlyBudget}
            step={5}
            value={monthlyBudget}
          />
          <SettingRange
            label="Daily AI budget"
            max={25}
            min={0}
            onChange={setDailyBudget}
            step={1}
            value={dailyBudget}
          />
          <SettingRange
            label="Max cost per task"
            max={5}
            min={0}
            onChange={setTaskCap}
            step={0.05}
            value={taskCap}
          />
          <SettingRange
            label="Max runs per task"
            max={10}
            min={1}
            onChange={setRuns}
            step={1}
            value={runs}
          />
          <SettingRange
            label="Require approval above"
            max={5}
            min={0}
            onChange={setApprovalThreshold}
            step={0.05}
            value={approvalThreshold}
          />
          <label className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/[0.04] p-3">
            <span>
              <span className="block text-sm font-medium text-white">Approval gate for external actions</span>
              <span className="block text-xs text-zinc-500">Posting, sending, spending, publishing, code, and investing stay gated.</span>
            </span>
            <input
              checked={approvalRequired}
              className="h-5 w-5 accent-cyan-300"
              onChange={(event) => setApprovalRequired(event.target.checked)}
              type="checkbox"
            />
          </label>
          <Button icon={<ShieldCheck size={15} />} variant="primary">Save Mock Settings</Button>
        </CardBody>
      </Card>
      <Card className="p-4">
        <CardHeader eyebrow="Future" title="API Key Placeholders" action={<KeyRound className="text-amber-200" size={18} />} />
        <CardBody className="space-y-3">
          {["Supabase URL", "Supabase anon key", "OpenAI API key", "Anthropic API key", "Alpaca paper key"].map((label) => (
            <label className="block" key={label}>
              <span className="mb-1 block text-xs text-zinc-500">{label}</span>
              <input
                className="h-10 w-full rounded-md border border-white/10 bg-black/30 px-3 text-sm text-zinc-500"
                disabled
                placeholder="Not required for local mock build"
              />
            </label>
          ))}
          <div className="rounded-lg border border-amber-300/20 bg-amber-300/[0.06] p-3 text-xs leading-5 text-amber-50">
            Real keys should stay server-side. The browser should never call model, brokerage, posting, or payment APIs directly.
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function SettingRange({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block rounded-lg border border-white/10 bg-white/[0.04] p-3">
      <span className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-white">{label}</span>
        <span className="font-mono text-zinc-300">
          {label.includes("runs") ? value : formatCurrency(value)}
        </span>
      </span>
      <input
        className="mt-3 w-full accent-cyan-300"
        max={max}
        min={min}
        onChange={(event) => onChange(Number(event.target.value))}
        step={step}
        type="range"
        value={value}
      />
    </label>
  );
}
