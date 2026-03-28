"use client";

import { useEffect, useMemo } from "react";
import Button from "@/components/ui/Button";
import { formatDataLoadErrorMessage } from "@/lib/mapErrors";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const displayMessage = useMemo(
    () =>
      formatDataLoadErrorMessage(
        error.message || "알 수 없는 오류가 발생했습니다.",
      ),
    [error.message],
  );

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      className="flex flex-col items-center justify-center gap-5 rounded-[1.75rem] border border-red-100 bg-white px-8 py-12 text-center shadow-[var(--shadow-taskly-soft)]"
      role="alert"
    >
      <h2 className="text-xl font-bold tracking-tight text-red-900">
        할일을 불러오는 중 문제가 발생했습니다
      </h2>
      <p className="max-w-md text-sm leading-relaxed text-red-700/90">
        {displayMessage}
      </p>
      <Button type="button" variant="primary" onClick={() => reset()}>
        다시 시도
      </Button>
    </div>
  );
}
