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
        className="flex gap-1 rounded-lg border border-gray-200 bg-gray-100/80 p-1"
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
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${
                selected
                  ? "bg-white text-indigo-700 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
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
