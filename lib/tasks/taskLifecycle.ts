import type { TaskStatus } from "@/lib/types/atlas";

export const taskLifecycle: TaskStatus[] = [
  "queued",
  "running",
  "waiting_approval",
  "completed",
];

export function canTransitionTask(from: TaskStatus, to: TaskStatus) {
  if (from === to) {
    return true;
  }

  if (from === "error" || from === "rejected") {
    return false;
  }

  const fromIndex = taskLifecycle.indexOf(from);
  const toIndex = taskLifecycle.indexOf(to);

  return fromIndex >= 0 && toIndex === fromIndex + 1;
}
