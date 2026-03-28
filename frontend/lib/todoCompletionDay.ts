import type { Todo } from "@/types/todo";

/** 로컬 기준 YYYY-MM-DD */
export function localDateKeyFromDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function localDateKeyFromIso(iso: string): string {
  return localDateKeyFromDate(new Date(iso));
}

/** 완료한 할일만 해당 날짜 키를 가짐. 미완료면 null */
export function todoCompletionDayKey(todo: Todo): string | null {
  if (!todo.is_completed) return null;
  const src = todo.completed_at ?? todo.updated_at;
  return localDateKeyFromIso(src);
}

export function formatDateKeyForDisplay(dateKey: string): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  if (!y || !m || !d) return dateKey;
  const dt = new Date(y, m - 1, d);
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(dt);
}

export function buildMonthDayCells(year: number, monthIndex: number): (number | null)[] {
  const dim = new Date(year, monthIndex + 1, 0).getDate();
  const start = new Date(year, monthIndex, 1).getDay();
  const cells: (number | null)[] = [];
  for (let i = 0; i < start; i++) cells.push(null);
  for (let day = 1; day <= dim; day++) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(null);
  while (cells.length < 42) cells.push(null);
  return cells;
}

export function makeDateKey(year: number, monthIndex: number, day: number): string {
  const m = String(monthIndex + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${m}-${dd}`;
}
