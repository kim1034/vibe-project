import { Todo } from "@/types/todo";

export type TodoTabFilter = "all" | "active" | "completed";

/** 생성일 기준 최신순 정렬 후 탭 필터 적용 */
export function filterTodosForTab(
  todos: Todo[],
  tab: TodoTabFilter,
): Todo[] {
  const sorted = [...todos].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
  switch (tab) {
    case "active":
      return sorted.filter((t) => !t.is_completed);
    case "completed":
      return sorted.filter((t) => t.is_completed);
    default:
      return sorted;
  }
}
