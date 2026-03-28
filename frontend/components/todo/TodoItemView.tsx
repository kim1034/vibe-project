"use client";

import type { Todo } from "@/types/todo";
import Button from "@/components/ui/Button";
import TodoItemPeriodBadge from "@/components/todo/TodoItemPeriodBadge";

export interface TodoItemViewProps {
  todo: Todo;
  completed: boolean;
  periodLine: string | null;
  onEdit: () => void;
  onDeleteClick: () => void;
  actionError: string;
}

export default function TodoItemView({
  todo,
  completed,
  periodLine,
  onEdit,
  onDeleteClick,
  actionError,
}: TodoItemViewProps) {
  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className={`text-base font-semibold ${
                completed
                  ? "text-white/95 line-through decoration-white/60"
                  : "text-gray-900"
              }`}
            >
              {todo.title}
            </h3>
            <TodoItemPeriodBadge todo={todo} />
          </div>
          {periodLine ? (
            <p
              className={`mt-1 text-sm ${
                completed ? "text-white/80" : "text-gray-600"
              }`}
            >
              {periodLine}
            </p>
          ) : null}
          {todo.memo ? (
            <p
              className={`mt-1 whitespace-pre-wrap text-sm ${
                completed ? "text-white/85" : "text-gray-600"
              }`}
            >
              {todo.memo}
            </p>
          ) : null}
        </div>
        <div className="flex shrink-0 gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onEdit}
            aria-label="할일 수정"
            className={
              completed
                ? "text-white hover:bg-white/15 focus-visible:ring-white/40"
                : ""
            }
          >
            수정
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={onDeleteClick}
            aria-label="할일 삭제"
            className={
              completed
                ? "bg-white/20 text-white ring-1 ring-white/30 hover:bg-white/30 focus-visible:ring-white/50"
                : ""
            }
          >
            삭제
          </Button>
        </div>
      </div>
      {actionError ? (
        <p
          className={`mt-2 text-sm ${completed ? "font-medium text-red-900" : "text-red-500"}`}
          role="alert"
        >
          {actionError}
        </p>
      ) : null}
    </>
  );
}
