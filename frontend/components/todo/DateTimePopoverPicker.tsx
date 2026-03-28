"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  formatDatetimeLocalForDisplay,
  getNowLocalParts,
  parseDatetimeLocalString,
  partsToDatetimeLocalString,
  type LocalDateTimeParts,
} from "@/lib/datetimeLocalPicker";
import {
  addCalendarMonths,
  formatCalendarMonthYearKo,
  WEEKDAY_LABELS_KO,
} from "@/lib/calendarLocale";
import { buildMonthDayCells } from "@/lib/todoCompletionDay";

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

const triggerBaseClass =
  "flex min-h-11 w-full items-center justify-between gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-left text-sm " +
  "transition-colors focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/25 " +
  "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 " +
  "touch-manipulation";

const selectClass =
  "min-h-11 w-full rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 " +
  "transition-colors focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/25 " +
  "disabled:cursor-not-allowed disabled:bg-gray-50";

function defaultDraft(value: string): LocalDateTimeParts {
  return parseDatetimeLocalString(value) ?? {
    ...getNowLocalParts(),
    hour: 9,
    minute: 0,
  };
}

export interface DateTimePopoverPickerProps {
  id: string;
  value: string;
  onChange: (next: string) => void;
  disabled?: boolean;
  hasError?: boolean;
  /** 공통 힌트·에러 id (aria-describedby) */
  describedBy?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DateTimePopoverPicker({
  id,
  value,
  onChange,
  disabled = false,
  hasError = false,
  describedBy,
  open,
  onOpenChange,
}: DateTimePopoverPickerProps) {
  const dialogId = useId();
  const titleId = `${dialogId}-title`;
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);

  const [viewYear, setViewYear] = useState(() => defaultDraft(value).year);
  const [viewMonthIndex, setViewMonthIndex] = useState(
    () => defaultDraft(value).monthIndex,
  );
  const [draft, setDraft] = useState<LocalDateTimeParts>(() =>
    defaultDraft(value),
  );
  const draftRef = useRef(draft);
  draftRef.current = draft;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const d = defaultDraft(value);
    draftRef.current = d;
    setDraft(d);
    setViewYear(d.year);
    setViewMonthIndex(d.monthIndex);
  }, [open, value]);

  /** 부모 setState는 setDraft 업데이터 안에서 호출하면 안 됨 (React 경고) */
  const commit = useCallback(
    (patch: Partial<LocalDateTimeParts>) => {
      const next = { ...draftRef.current, ...patch };
      draftRef.current = next;
      setDraft(next);
      onChange(partsToDatetimeLocalString(next));
    },
    [onChange],
  );

  const goPrevMonth = useCallback(() => {
    const next = addCalendarMonths(viewYear, viewMonthIndex, -1);
    setViewYear(next.year);
    setViewMonthIndex(next.monthIndex);
  }, [viewYear, viewMonthIndex]);

  const goNextMonth = useCallback(() => {
    const next = addCalendarMonths(viewYear, viewMonthIndex, 1);
    setViewYear(next.year);
    setViewMonthIndex(next.monthIndex);
  }, [viewYear, viewMonthIndex]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onOpenChange(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => {
      panelRef.current
        ?.querySelector<HTMLElement>("button[data-day-focus='true']")
        ?.focus();
    }, 0);
    return () => window.clearTimeout(t);
  }, [open, viewYear, viewMonthIndex]);

  const monthLabel = formatCalendarMonthYearKo(viewYear, viewMonthIndex);

  const cells = buildMonthDayCells(viewYear, viewMonthIndex);
  const now = new Date();
  const todayY = now.getFullYear();
  const todayM = now.getMonth();
  const todayD = now.getDate();

  const displayText = value
    ? formatDatetimeLocalForDisplay(value)
    : "날짜·시간 선택";

  const portal =
    open &&
    mounted &&
    createPortal(
      <div
        className="fixed inset-0 z-[200] flex items-end justify-center bg-gray-900/25 p-0 sm:items-center sm:p-6"
        role="presentation"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) {
            onOpenChange(false);
            triggerRef.current?.focus();
          }
        }}
      >
        <div
          ref={panelRef}
          id={dialogId}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="max-h-[min(85dvh,calc(100vh-2rem))] w-full max-w-md overflow-y-auto rounded-t-[1.75rem] border border-gray-100 bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom,0px))] shadow-[var(--shadow-taskly-soft)] sm:rounded-[1.75rem] sm:pb-5"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-3">
            <h2 id={titleId} className="text-base font-bold text-gray-900">
              {monthLabel}
            </h2>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={goPrevMonth}
                className="min-h-11 min-w-11 rounded-full border border-gray-100 text-sm font-medium text-gray-600 transition-colors hover:bg-amber-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                aria-label="이전 달"
              >
                ◀
              </button>
              <button
                type="button"
                onClick={goNextMonth}
                className="min-h-11 min-w-11 rounded-full border border-gray-100 text-sm font-medium text-gray-600 transition-colors hover:bg-amber-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                aria-label="다음 달"
              >
                ▶
              </button>
            </div>
          </div>

          <div
            className="mt-3 grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-gray-400"
            role="grid"
            aria-readonly="true"
          >
            {WEEKDAY_LABELS_KO.map((d) => (
              <div key={d} className="py-1" role="columnheader">
                {d}
              </div>
            ))}
            {cells.map((day, slot) => {
              if (day === null) {
                return (
                  <div
                    key={`e-${slot}`}
                    className="flex h-11 items-center justify-center text-transparent"
                    aria-hidden
                  >
                    ·
                  </div>
                );
              }
              const isToday =
                viewYear === todayY &&
                viewMonthIndex === todayM &&
                day === todayD;
              const isSelected =
                draft.year === viewYear &&
                draft.monthIndex === viewMonthIndex &&
                draft.day === day;
              const firstDaySlot = cells.findIndex((c) => c !== null);
              const selectedInView =
                draft.year === viewYear && draft.monthIndex === viewMonthIndex;
              const focusThis =
                (selectedInView && isSelected) ||
                (!selectedInView && slot === firstDaySlot);

              return (
                <button
                  key={`${viewYear}-${viewMonthIndex}-${day}`}
                  type="button"
                  role="gridcell"
                  data-day-focus={focusThis ? "true" : undefined}
                  onClick={() => {
                    commit({
                      year: viewYear,
                      monthIndex: viewMonthIndex,
                      day,
                    });
                  }}
                  className={`flex h-11 items-center justify-center rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-1 ${
                    isSelected
                      ? "bg-[var(--color-taskly-accent)] text-gray-900 shadow-sm"
                      : isToday
                        ? "ring-2 ring-[var(--color-taskly-accent)]/45 ring-offset-1 text-gray-900 hover:bg-amber-50"
                        : "text-gray-800 hover:bg-gray-50"
                  }`}
                  aria-pressed={isSelected}
                  aria-label={`${day}일 선택`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={`${dialogId}-h`}
                className="text-xs font-medium text-gray-600"
              >
                시각
              </label>
              <select
                id={`${dialogId}-h`}
                className={selectClass}
                value={draft.hour}
                onChange={(e) => {
                  commit({ hour: Number(e.target.value) });
                }}
                aria-label="시"
              >
                {HOURS.map((h) => (
                  <option key={h} value={h}>
                    {String(h).padStart(2, "0")}시
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={`${dialogId}-m`}
                className="text-xs font-medium text-gray-600"
              >
                분
              </label>
              <select
                id={`${dialogId}-m`}
                className={selectClass}
                value={draft.minute}
                onChange={(e) => {
                  commit({ minute: Number(e.target.value) });
                }}
                aria-label="분"
              >
                {MINUTES.map((m) => (
                  <option key={m} value={m}>
                    {String(m).padStart(2, "0")}분
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-4">
            <button
              type="button"
              className="min-h-11 rounded-full px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              onClick={() => {
                const fresh = defaultDraft("");
                draftRef.current = fresh;
                setDraft(fresh);
                setViewYear(fresh.year);
                setViewMonthIndex(fresh.monthIndex);
                onChange("");
                onOpenChange(false);
                triggerRef.current?.focus();
              }}
            >
              비우기
            </button>
            <button
              type="button"
              className="min-h-11 rounded-full border border-gray-200 bg-white px-5 text-sm font-semibold text-gray-800 shadow-sm transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              onClick={() => {
                onOpenChange(false);
                triggerRef.current?.focus();
              }}
            >
              닫기
            </button>
          </div>
        </div>
      </div>,
      document.body,
    );

  const errClass = hasError
    ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
    : "";

  return (
    <>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        disabled={disabled}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls={dialogId}
        aria-invalid={hasError ? true : undefined}
        aria-describedby={describedBy}
        onClick={() => {
          if (disabled) return;
          onOpenChange(!open);
        }}
        className={`${triggerBaseClass} ${value ? "text-gray-900" : "text-gray-400"} ${errClass}`}
      >
        <span className="min-w-0 flex-1 truncate">{displayText}</span>
        <span
          className="shrink-0 text-gray-400"
          aria-hidden
        >
          ▾
        </span>
      </button>
      {portal}
    </>
  );
}
