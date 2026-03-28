"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AddTodoForm from "@/components/todo/AddTodoForm";
import TodoCompletionCalendar from "@/components/todo/TodoCompletionCalendar";
import TodoFilter from "@/components/todo/TodoFilter";
import TodoList from "@/components/todo/TodoList";
import type { Todo } from "@/types/todo";
import { formatDateKeyForDisplay, todoCompletionDayKey } from "@/lib/todoCompletionDay";
import {
  type TodoTabFilter,
  filterTodosForTab,
} from "@/lib/todoFilters";

interface DashboardTodoClientProps {
  initialTodos: Todo[];
}

export default function DashboardTodoClient({
  initialTodos,
}: DashboardTodoClientProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<TodoTabFilter>("all");
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);

  const refresh = useCallback(() => {
    router.refresh();
  }, [router]);

  const filtered = useMemo(() => {
    let list = filterTodosForTab(initialTodos, filter);
    if (selectedDateKey) {
      list = list.filter((t) => todoCompletionDayKey(t) === selectedDateKey);
    }
    return list;
  }, [initialTodos, filter, selectedDateKey]);

  return (
    <>
      <div className="flex w-full flex-col gap-8 pb-[calc(22rem+env(safe-area-inset-bottom,0px))]">
        <AddTodoForm onSuccess={refresh} />
        {selectedDateKey ? (
          <div
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-100/80 bg-[var(--color-taskly-accent)]/15 px-4 py-3 text-sm"
            role="status"
          >
            <p className="font-medium text-gray-800">
              <span className="text-gray-500">선택한 날짜 · </span>
              {formatDateKeyForDisplay(selectedDateKey)}에 완료한 할일
            </p>
            <button
              type="button"
              onClick={() => setSelectedDateKey(null)}
              className="shrink-0 rounded-full border border-gray-200/80 bg-white px-4 py-1.5 text-xs font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              날짜 필터 해제
            </button>
          </div>
        ) : null}
        <section aria-labelledby="todo-list-heading">
          <h2 id="todo-list-heading" className="sr-only">
            할일 목록
          </h2>
          <TodoFilter
            value={filter}
            onChange={setFilter}
            className="mb-6"
          />
          <TodoList
            todos={filtered}
            activeFilter={filter}
            completionDateKey={selectedDateKey}
            onTodoChange={refresh}
          />
        </section>
      </div>

      <div
        className="fixed bottom-0 left-0 z-40 p-4 pl-[max(1rem,env(safe-area-inset-left,0px))] pb-[max(1rem,env(safe-area-inset-bottom,0px))]"
        role="presentation"
      >
        <TodoCompletionCalendar
          todos={initialTodos}
          selectedDateKey={selectedDateKey}
          onSelectDateKey={setSelectedDateKey}
          className="w-[min(calc(100vw-2rem),22rem)] shadow-lg"
        />
      </div>
    </>
  );
}
