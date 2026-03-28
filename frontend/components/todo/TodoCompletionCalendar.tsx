"use client";

import { useMemo, useState } from "react";
import type { Todo } from "@/types/todo";
import {
  buildMonthDayCells,
  localDateKeyFromDate,
  makeDateKey,
  todoCompletionDayKey,
} from "@/lib/todoCompletionDay";

interface TodoCompletionCalendarProps {
  todos: Todo[];
  selectedDateKey: string | null;
  onSelectDateKey: (key: string | null) => void;
  className?: string;
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export default function TodoCompletionCalendar({
  todos,
  selectedDateKey,
  onSelectDateKey,
  className = "",
}: TodoCompletionCalendarProps) {
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonthIndex, setViewMonthIndex] = useState(now.getMonth());

  const todayKey = localDateKeyFromDate(now);

  const completionCountByDay = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of todos) {
      const key = todoCompletionDayKey(t);
      if (!key) continue;
      const [y, m] = key.split("-").map(Number);
      if (y === viewYear && m === viewMonthIndex + 1) {
        map.set(key, (map.get(key) ?? 0) + 1);
      }
    }
    return map;
  }, [todos, viewYear, viewMonthIndex]);

  const cells = useMemo(
    () => buildMonthDayCells(viewYear, viewMonthIndex),
    [viewYear, viewMonthIndex],
  );

  const monthLabel = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
  }).format(new Date(viewYear, viewMonthIndex, 1));

  function goPrevMonth() {
    if (viewMonthIndex === 0) {
      setViewMonthIndex(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonthIndex((m) => m - 1);
    }
  }

  function goNextMonth() {
    if (viewMonthIndex === 11) {
      setViewMonthIndex(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonthIndex((m) => m + 1);
    }
  }

  function handleDayClick(day: number) {
    const key = makeDateKey(viewYear, viewMonthIndex, day);
    if (selectedDateKey === key) {
      onSelectDateKey(null);
    } else {
      onSelectDateKey(key);
    }
  }

  return (
    <section
      className={`rounded-[1.75rem] border border-gray-100 bg-white p-6 shadow-[var(--shadow-taskly-soft)] ${className}`}
      aria-label="완료한 날짜별 보기"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-base font-bold text-gray-900">{monthLabel}</h2>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={goPrevMonth}
            className="rounded-full border border-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            aria-label="이전 달"
          >
            ◀
          </button>
          <button
            type="button"
            onClick={goNextMonth}
            className="rounded-full border border-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            aria-label="다음 달"
          >
            ▶
          </button>
        </div>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-gray-500">
        날짜를 누르면 그날 완료 처리한 할일만 목록에 표시됩니다. 다시 누르면
        필터가 해제됩니다.
      </p>
      <div
        className="mt-4 grid grid-cols-7 gap-1.5 text-center text-[11px] font-medium text-gray-400"
        role="grid"
        aria-readonly="true"
      >
        {WEEKDAYS.map((d) => (
          <div key={d} role="columnheader" className="py-1">
            {d}
          </div>
        ))}
        {cells.map((day, slot) => {
          if (day === null) {
            return (
              <div
                key={`e-${slot}`}
                className="flex h-9 items-center justify-center text-transparent"
                aria-hidden
              >
                ·
              </div>
            );
          }
          const key = makeDateKey(viewYear, viewMonthIndex, day);
          const count = completionCountByDay.get(key) ?? 0;
          const isSelected = selectedDateKey === key;
          const isToday = key === todayKey;

          return (
            <button
              key={key}
              type="button"
              role="gridcell"
              aria-pressed={isSelected}
              aria-label={`${day}일${count > 0 ? `, 완료 ${count}건` : ""}${isSelected ? ", 선택됨" : ""}`}
              onClick={() => handleDayClick(day)}
              className={`relative flex h-9 items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 ${
                isSelected
                  ? "bg-[var(--color-taskly-accent)] text-gray-900 shadow-sm"
                  : isToday
                    ? "ring-2 ring-[var(--color-taskly-accent)]/50 ring-offset-1 ring-offset-white text-gray-900 hover:bg-amber-50"
                    : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {day}
              {count > 0 ? (
                <span
                  className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-amber-600/80"
                  aria-hidden
                />
              ) : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}
