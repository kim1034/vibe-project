"use client";

import { KeyboardEvent } from "react";
import { TodoTabFilter } from "@/lib/todoFilters";

interface TodoFilterProps {
  value: TodoTabFilter;
  onChange: (next: TodoTabFilter) => void;
  className?: string;
}

const tabs: { id: TodoTabFilter; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "active", label: "진행중" },
  { id: "completed", label: "완료" },
];

export default function TodoFilter({
  value,
  onChange,
  className = "",
}: TodoFilterProps) {
  function handleTabListKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const idx = tabs.findIndex((t) => t.id === value);
    if (idx < 0) return;
    const delta = e.key === "ArrowRight" ? 1 : -1;
    const nextIdx = (idx + delta + tabs.length) % tabs.length;
    const next = tabs[nextIdx];
    onChange(next.id);
    document.getElementById(`todo-filter-${next.id}`)?.focus();
  }

  return (
    <div className={className}>
      <div
        className="flex gap-1 rounded-full border border-gray-100 bg-white/90 p-1.5 shadow-[0_8px_24px_-8px_rgba(17,24,39,0.08)]"
        role="tablist"
        aria-label="할일 필터"
        onKeyDown={handleTabListKeyDown}
      >
        {tabs.map((tab) => {
          const selected = value === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
              id={`todo-filter-${tab.id}`}
              className={`flex-1 rounded-full px-3 py-2.5 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 ${
                selected
                  ? "bg-[var(--color-taskly-accent)] text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
              onClick={() => onChange(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
