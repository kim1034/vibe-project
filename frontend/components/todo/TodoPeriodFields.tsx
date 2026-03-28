"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";

const DateTimePopoverPicker = dynamic(
  () => import("@/components/todo/DateTimePopoverPicker"),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-11 w-full items-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/80 px-4 py-2.5 text-sm text-gray-400">
        날짜·시간 선택 불러오는 중…
      </div>
    ),
  },
);

interface TodoPeriodFieldsProps {
  startsId: string;
  endsId: string;
  startsValue: string;
  endsValue: string;
  onStartsChange: (value: string) => void;
  onEndsChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  /** 폼 안내(추가 폼만 사용) */
  hint?: string;
}

export default function TodoPeriodFields({
  startsId,
  endsId,
  startsValue,
  endsValue,
  onStartsChange,
  onEndsChange,
  error,
  disabled = false,
  hint,
}: TodoPeriodFieldsProps) {
  const [openSlot, setOpenSlot] = useState<"start" | "end" | null>(null);

  const hintId = `${startsId}-period-hint`;
  const errId = `${startsId}-period-err`;
  const describedBy =
    [hint ? hintId : null, error ? errId : null].filter(Boolean).join(" ") ||
    undefined;

  const onStartOpenChange = useCallback((next: boolean) => {
    setOpenSlot((prev) => {
      if (next) return "start";
      if (prev === "start") return null;
      return prev;
    });
  }, []);

  const onEndOpenChange = useCallback((next: boolean) => {
    setOpenSlot((prev) => {
      if (next) return "end";
      if (prev === "end") return null;
      return prev;
    });
  }, []);

  return (
    <div className="flex flex-col gap-3">
      {hint ? (
        <p id={hintId} className="text-xs text-gray-500">
          {hint}
        </p>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={startsId} className="text-sm font-medium text-gray-800">
            시작 일시 <span className="font-normal text-gray-400">(선택)</span>
          </label>
          <DateTimePopoverPicker
            id={startsId}
            value={startsValue}
            onChange={onStartsChange}
            disabled={disabled}
            hasError={Boolean(error)}
            describedBy={describedBy}
            open={openSlot === "start"}
            onOpenChange={onStartOpenChange}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={endsId} className="text-sm font-medium text-gray-800">
            종료·마감 일시 <span className="font-normal text-gray-400">(선택)</span>
          </label>
          <DateTimePopoverPicker
            id={endsId}
            value={endsValue}
            onChange={onEndsChange}
            disabled={disabled}
            hasError={Boolean(error)}
            describedBy={describedBy}
            open={openSlot === "end"}
            onOpenChange={onEndOpenChange}
          />
        </div>
      </div>
      {error ? (
        <p id={errId} className="text-xs text-red-500" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
