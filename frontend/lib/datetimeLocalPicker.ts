/** HTML `datetime-local` 값 `YYYY-MM-DDTHH:mm` (로컬 의미) 파싱·조합 */

import { WEEKDAY_LABELS_KO } from "@/lib/calendarLocale";

export interface LocalDateTimeParts {
  year: number;
  monthIndex: number;
  day: number;
  hour: number;
  minute: number;
}

export function getNowLocalParts(): LocalDateTimeParts {
  const d = new Date();
  return {
    year: d.getFullYear(),
    monthIndex: d.getMonth(),
    day: d.getDate(),
    hour: d.getHours(),
    minute: d.getMinutes(),
  };
}

export function parseDatetimeLocalString(s: string): LocalDateTimeParts | null {
  if (!s || typeof s !== "string") return null;
  const tIdx = s.indexOf("T");
  if (tIdx < 0) return null;
  const datePart = s.slice(0, tIdx);
  const timePart = s.slice(tIdx + 1);
  const [ys, ms, ds] = datePart.split("-").map((x) => Number(x));
  const [hs, mins] = timePart.split(":").map((x) => Number(x));
  if (
    !Number.isFinite(ys) ||
    !Number.isFinite(ms) ||
    !Number.isFinite(ds) ||
    !Number.isFinite(hs) ||
    !Number.isFinite(mins)
  ) {
    return null;
  }
  if (ms < 1 || ms > 12 || ds < 1 || ds > 31 || hs < 0 || hs > 23 || mins < 0 || mins > 59) {
    return null;
  }
  const last = new Date(ys, ms, 0).getDate();
  if (ds > last) return null;
  return {
    year: ys,
    monthIndex: ms - 1,
    day: ds,
    hour: hs,
    minute: mins,
  };
}

export function partsToDatetimeLocalString(p: LocalDateTimeParts): string {
  const m = String(p.monthIndex + 1).padStart(2, "0");
  const d = String(p.day).padStart(2, "0");
  const h = String(p.hour).padStart(2, "0");
  const min = String(p.minute).padStart(2, "0");
  return `${p.year}-${m}-${d}T${h}:${min}`;
}

/**
 * `Intl` 대신 고정 한국어 요일·오전/오후를 써서 서버·클라이언트 문자열을 맞춘다.
 */
export function formatDatetimeLocalForDisplay(value: string): string {
  const p = parseDatetimeLocalString(value);
  if (!p) return "";
  const wd = WEEKDAY_LABELS_KO[
    new Date(p.year, p.monthIndex, p.day).getDay()
  ];
  const month = p.monthIndex + 1;
  const isAm = p.hour < 12;
  const period = isAm ? "오전" : "오후";
  let h12 = p.hour % 12;
  if (h12 === 0) h12 = 12;
  const mm = String(p.minute).padStart(2, "0");
  return `${p.year}년 ${month}월 ${p.day}일 (${wd}) ${period} ${h12}:${mm}`;
}
