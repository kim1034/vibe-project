"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AddTodoForm from "@/components/todo/AddTodoForm";
import TodoFilter from "@/components/todo/TodoFilter";
import TodoList from "@/components/todo/TodoList";
import type { Todo } from "@/types/todo";
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

  const refresh = useCallback(() => {
    router.refresh();
  }, [router]);

  const filtered = useMemo(
    () => filterTodosForTab(initialTodos, filter),
    [initialTodos, filter],
  );

  return (
    <div className="flex w-full flex-col gap-6">
      <AddTodoForm onSuccess={refresh} />
      <section aria-labelledby="todo-list-heading">
        <h2 id="todo-list-heading" className="sr-only">
          할일 목록
        </h2>
        <TodoFilter
          value={filter}
          onChange={setFilter}
          className="mb-4"
        />
        <TodoList
          todos={filtered}
          activeFilter={filter}
          onTodoChange={refresh}
        />
      </section>
    </div>
  );
}
