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

/**
 * Node·브라우저 ICU 차이로 `Intl`이 서버에서는 AM/PM, 클라이언트에서는 오전/오후를 쓰는 경우가 있어
 * 하이드레이션 불일치가 난다. 로캘 대신 고정 한국어 라벨로 맞춘다.
 */
function formatShortDateTimeKo(d: Date): string {
  const yy = String(d.getFullYear() % 100).padStart(2, "0");
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hour24 = d.getHours();
  const minute = d.getMinutes();
  const isAm = hour24 < 12;
  const period = isAm ? "오전" : "오후";
  let h12 = hour24 % 12;
  if (h12 === 0) h12 = 12;
  const mm = String(minute).padStart(2, "0");
  return `${yy}. ${month}. ${day}. ${period} ${h12}:${mm}`;
}

/** 목록·카드에 표시할 한 줄 요약 */
export function formatTodoPeriodLine(todo: Pick<Todo, "starts_at" | "ends_at">): string | null {
  if (!todo.starts_at && !todo.ends_at) return null;
  if (todo.starts_at && todo.ends_at) {
    return `${formatShortDateTimeKo(new Date(todo.starts_at))} ~ ${formatShortDateTimeKo(new Date(todo.ends_at))}`;
  }
  if (todo.ends_at) {
    return `마감 ${formatShortDateTimeKo(new Date(todo.ends_at))}`;
  }
  if (todo.starts_at) {
    return `시작 ${formatShortDateTimeKo(new Date(todo.starts_at))}`;
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
