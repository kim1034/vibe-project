"use client";

import type { Todo } from "@/types/todo";
import {
  periodBadgeForTodo,
  type PeriodBadgeKind,
} from "@/lib/todoPeriod";

const BADGE_BY_KIND: Record<PeriodBadgeKind, string> = {
  overdue: "bg-red-100 text-red-800 ring-1 ring-red-200/80",
  today: "bg-amber-200/90 text-amber-950 ring-1 ring-amber-300/60",
  soon: "bg-sky-100 text-sky-900 ring-1 ring-sky-200/80",
  later: "bg-gray-100 text-gray-700 ring-1 ring-gray-200/80",
  started_only: "bg-violet-100 text-violet-900 ring-1 ring-violet-200/80",
};

export default function TodoItemPeriodBadge({ todo }: { todo: Todo }) {
  const badge = periodBadgeForTodo(todo);
  if (!badge) return null;
  const done = todo.is_completed;
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
        done
          ? "bg-white/25 text-white ring-1 ring-white/40"
          : BADGE_BY_KIND[badge.kind]
      }`}
    >
      {badge.label}
    </span>
  );
}
