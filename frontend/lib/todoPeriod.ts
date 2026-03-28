import type { Todo } from "@/types/todo";

/** datetime-local 입력값(로컬) ↔ UTC ISO 문자열 */

export function isoToDatetimeLocalValue(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function datetimeLocalValueToIso(value: string): string | null {
  const t = value.trim();
  if (!t) return null;
  const d = new Date(t);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

/** 정렬용: 마감(종료) 우선, 없으면 시작, 둘 다 없으면 null */
const periodFmt = new Intl.DateTimeFormat("ko-KR", {
  dateStyle: "short",
  timeStyle: "short",
});

/** 목록·카드에 표시할 한 줄 요약 */
export function formatTodoPeriodLine(todo: Pick<Todo, "starts_at" | "ends_at">): string | null {
  if (!todo.starts_at && !todo.ends_at) return null;
  if (todo.starts_at && todo.ends_at) {
    return `${periodFmt.format(new Date(todo.starts_at))} ~ ${periodFmt.format(new Date(todo.ends_at))}`;
  }
  if (todo.ends_at) {
    return `마감 ${periodFmt.format(new Date(todo.ends_at))}`;
  }
  if (todo.starts_at) {
    return `시작 ${periodFmt.format(new Date(todo.starts_at))}`;
  }
  return null;
}

export function effectivePeriodMs(todo: {
  starts_at: string | null;
  ends_at: string | null;
}): number | null {
  if (todo.ends_at) {
    const ms = new Date(todo.ends_at).getTime();
    return Number.isNaN(ms) ? null : ms;
  }
  if (todo.starts_at) {
    const ms = new Date(todo.starts_at).getTime();
    return Number.isNaN(ms) ? null : ms;
  }
  return null;
}

export type PeriodBadgeKind =
  | "overdue"
  | "today"
  | "soon"
  | "later"
  | "started_only";

const DAY_MS = 86_400_000;

function startOfLocalDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

/**
 * 미완료 할일에 대해 종료(또는 시작만 있는 경우 시작) 기준 배지.
 * 완료된 항목은 호출하지 않는 것을 권장.
 */
export function periodBadgeForTodo(todo: {
  starts_at: string | null;
  ends_at: string | null;
  is_completed: boolean;
}): { kind: PeriodBadgeKind; label: string } | null {
  if (todo.is_completed) return null;

  const now = new Date();
  const todayStart = startOfLocalDay(now);

  if (todo.ends_at) {
    const end = new Date(todo.ends_at);
    if (Number.isNaN(end.getTime())) return null;
    const endMs = end.getTime();
    const endDay = startOfLocalDay(end);
    const diffDays = Math.floor((endDay - todayStart) / DAY_MS);

    if (endMs < now.getTime()) {
      return { kind: "overdue", label: "지남" };
    }
    if (diffDays === 0) {
      return { kind: "today", label: "오늘" };
    }
    if (diffDays <= 7) {
      return { kind: "soon", label: `D-${diffDays}` };
    }
    return { kind: "later", label: "예정" };
  }

  if (todo.starts_at) {
    const start = new Date(todo.starts_at);
    if (Number.isNaN(start.getTime())) return null;
    return { kind: "started_only", label: "시작 설정" };
  }

  return null;
}
