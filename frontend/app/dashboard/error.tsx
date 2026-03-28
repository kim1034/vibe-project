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
      className="flex flex-col items-center justify-center gap-4 rounded-lg border border-red-200 bg-red-50 px-6 py-10 text-center"
      role="alert"
    >
      <h2 className="text-lg font-semibold text-red-900">
        할일을 불러오는 중 문제가 발생했습니다
      </h2>
      <p className="max-w-md text-sm text-red-700">{displayMessage}</p>
      <Button type="button" variant="primary" onClick={() => reset()}>
        다시 시도
      </Button>
    </div>
  );
}
