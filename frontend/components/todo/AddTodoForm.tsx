"use client";

import { FormEvent, useId, useState, useTransition } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import TodoPeriodFields from "@/components/todo/TodoPeriodFields";
import { createTodo } from "@/app/actions/todo";
import { datetimeLocalValueToIso } from "@/lib/todoPeriod";

const TITLE_MAX = 200;
const MEMO_MAX = 1000;

interface AddTodoFormProps {
  /** 추가 성공 후 호출 — 부모에서 `getTodos()` 등으로 목록을 다시 불러오면 됩니다 */
  onSuccess?: () => void;
  className?: string;
}

export default function AddTodoForm({
  onSuccess,
  className = "",
}: AddTodoFormProps) {
  const formId = useId();
  const memoId = `${formId}-memo`;
  const startsId = `${formId}-starts`;
  const endsId = `${formId}-ends`;

  const [title, setTitle] = useState("");
  const [memo, setMemo] = useState("");
  const [startsLocal, setStartsLocal] = useState("");
  const [endsLocal, setEndsLocal] = useState("");
  const [titleError, setTitleError] = useState("");
  const [memoError, setMemoError] = useState("");
  const [periodError, setPeriodError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isPending, startTransition] = useTransition();

  function validateFields(): boolean {
    const trimmed = title.trim();
    let ok = true;
    setTitleError("");
    setMemoError("");
    setPeriodError("");

    if (!trimmed) {
      setTitleError("제목을 입력해주세요.");
      ok = false;
    } else if (trimmed.length > TITLE_MAX) {
      setTitleError(`제목은 ${TITLE_MAX}자 이내로 입력해주세요.`);
      ok = false;
    }

    if (memo.length > MEMO_MAX) {
      setMemoError(`메모는 ${MEMO_MAX}자 이내로 입력해주세요.`);
      ok = false;
    }

    if (startsLocal && endsLocal) {
      const a = new Date(startsLocal).getTime();
      const b = new Date(endsLocal).getTime();
      if (!Number.isNaN(a) && !Number.isNaN(b) && b < a) {
        setPeriodError("종료 일시는 시작 일시보다 이후여야 합니다.");
        ok = false;
      }
    }

    return ok;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError("");

    if (!validateFields()) {
      return;
    }

    startTransition(async () => {
      const startsIso = datetimeLocalValueToIso(startsLocal);
      const endsIso = datetimeLocalValueToIso(endsLocal);
      const result = await createTodo(
        title,
        memo || undefined,
        startsIso,
        endsIso,
      );
      if (!result.success) {
        setSubmitError(result.error);
        return;
      }
      setTitle("");
      setMemo("");
      setStartsLocal("");
      setEndsLocal("");
      onSuccess?.();
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-[1.75rem] border border-gray-100 bg-white p-6 shadow-[var(--shadow-taskly-soft)] sm:p-8 ${className}`}
      noValidate
    >
      <h2 className="mb-6 text-2xl font-bold tracking-tight text-gray-900">
        새{" "}
        <span className="text-[var(--color-taskly-accent)] drop-shadow-sm">
          할일
        </span>
      </h2>

      <div className="flex flex-col gap-4">
        <div>
          <Input
            label="제목"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="할일 제목"
            maxLength={TITLE_MAX}
            error={titleError || undefined}
            autoComplete="off"
          />
          <p
            id={`${formId}-title-hint`}
            className="mt-1 text-right text-xs text-gray-400"
          >
            {title.length}/{TITLE_MAX}
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={memoId} className="text-sm font-medium text-gray-800">
            메모 <span className="font-normal text-gray-400">(선택)</span>
          </label>
          <textarea
            id={memoId}
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="추가 설명이 있으면 입력하세요"
            maxLength={MEMO_MAX}
            rows={4}
            className={`rounded-2xl border px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400
              transition-colors focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/25
              disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500
              ${
                memoError
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                  : "border-gray-200"
              }`}
            aria-invalid={memoError ? true : undefined}
            aria-describedby={
              memoError ? `${memoId}-err ${memoId}-hint` : `${memoId}-hint`
            }
          />
          <div className="flex justify-between gap-2">
            {memoError ? (
              <p id={`${memoId}-err`} className="text-xs text-red-500" role="alert">
                {memoError}
              </p>
            ) : (
              <span />
            )}
            <p id={`${memoId}-hint`} className="text-right text-xs text-gray-400">
              {memo.length}/{MEMO_MAX}
            </p>
          </div>
        </div>

        <TodoPeriodFields
          startsId={startsId}
          endsId={endsId}
          startsValue={startsLocal}
          endsValue={endsLocal}
          onStartsChange={setStartsLocal}
          onEndsChange={setEndsLocal}
          error={periodError || undefined}
          disabled={isPending}
          hint="비워 두면 기간 없음. 입력한 시각은 이 기기의 로컬 시간이며, 저장 시 UTC로 맞춰집니다."
        />

        {submitError && (
          <p className="text-sm text-red-500" role="alert">
            {submitError}
          </p>
        )}

        <Button type="submit" loading={isPending} className="self-end px-6">
          추가
        </Button>
      </div>
    </form>
  );
}
