import type { Todo } from "@/types/todo";
import { effectivePeriodMs } from "@/lib/todoPeriod";

export type TodoTabFilter = "all" | "active" | "completed";

function sortPeriodThenCreated(a: Todo, b: Todo): number {
  const pa = effectivePeriodMs(a);
  const pb = effectivePeriodMs(b);
  const ia = pa ?? Number.POSITIVE_INFINITY;
  const ib = pb ?? Number.POSITIVE_INFINITY;
  if (ia !== ib) return ia - ib;
  return (
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

/** 마감·시작 임박순(기간 없음은 맨 아래), 동률이면 생성 최신순. 탭 필터 적용 */
export function filterTodosForTab(
  todos: Todo[],
  tab: TodoTabFilter,
): Todo[] {
  const sorted = [...todos].sort(sortPeriodThenCreated);
  switch (tab) {
    case "active":
      return sorted.filter((t) => !t.is_completed);
    case "completed":
      return sorted.filter((t) => t.is_completed);
    default:
      return sorted;
  }
}
