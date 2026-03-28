/** 달력 UI 공통 — 요일 헤더·월 라벨·월 이동 (Node/브라우저 Intl 차이 최소화) */

export const WEEKDAY_LABELS_KO = [
  "일",
  "월",
  "화",
  "수",
  "목",
  "금",
  "토",
] as const;

export function formatCalendarMonthYearKo(
  year: number,
  monthIndex: number,
): string {
  return `${year}년 ${monthIndex + 1}월`;
}

export function addCalendarMonths(
  year: number,
  monthIndex: number,
  delta: number,
): { year: number; monthIndex: number } {
  const d = new Date(year, monthIndex + delta, 1);
  return { year: d.getFullYear(), monthIndex: d.getMonth() };
}
