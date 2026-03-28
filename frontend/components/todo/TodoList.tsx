import type { Todo } from "@/types/todo";
import { TodoTabFilter } from "@/lib/todoFilters";
import EmptyState from "./EmptyState";
import TodoItem from "./TodoItem";

interface TodoListProps {
  todos: Todo[];
  /** 빈 목록일 때 안내 문구를 탭에 맞게 표시합니다 */
  activeFilter: TodoTabFilter;
  /** 완료일 기준 날짜 필터(YYYY-MM-DD) */
  completionDateKey?: string | null;
  /** 항목 변경(토글·수정·삭제) 후 목록 갱신 */
  onTodoChange?: () => void;
  className?: string;
}

export default function TodoList({
  todos,
  activeFilter,
  completionDateKey = null,
  onTodoChange,
  className = "",
}: TodoListProps) {
  if (todos.length === 0) {
    return (
      <EmptyState
        filter={activeFilter}
        completionDateKey={completionDateKey}
        className={className}
      />
    );
  }

  return (
    <ul
      className={`flex flex-col gap-4 ${className}`}
      aria-label="할일 목록"
    >
      {todos.map((todo) => (
        <li key={todo.id}>
          <TodoItem todo={todo} onChanged={onTodoChange} />
        </li>
      ))}
    </ul>
  );
}
