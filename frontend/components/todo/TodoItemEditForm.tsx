"use client";

import type { FormEvent } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import TodoPeriodFields from "@/components/todo/TodoPeriodFields";
import { MEMO_MAX, TITLE_MAX } from "@/lib/todoConstraints";

export interface TodoItemEditFormProps {
  memoId: string;
  startsId: string;
  endsId: string;
  editTitle: string;
  editMemo: string;
  editStartsLocal: string;
  editEndsLocal: string;
  onEditTitle: (value: string) => void;
  onEditMemo: (value: string) => void;
  onEditStarts: (value: string) => void;
  onEditEnds: (value: string) => void;
  titleError: string;
  memoError: string;
  periodError: string;
  actionError: string;
  savePending: boolean;
  onSubmit: (e: FormEvent) => void;
  onCancel: () => void;
}

export default function TodoItemEditForm({
  memoId,
  startsId,
  endsId,
  editTitle,
  editMemo,
  editStartsLocal,
  editEndsLocal,
  onEditTitle,
  onEditMemo,
  onEditStarts,
  onEditEnds,
  titleError,
  memoError,
  periodError,
  actionError,
  savePending,
  onSubmit,
  onCancel,
}: TodoItemEditFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <Input
        label="제목"
        required
        value={editTitle}
        onChange={(e) => onEditTitle(e.target.value)}
        maxLength={TITLE_MAX}
        error={titleError || undefined}
        autoComplete="off"
      />
      <p className="text-right text-xs text-gray-400">
        {editTitle.length}/{TITLE_MAX}
      </p>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={memoId}
          className="text-sm font-medium text-gray-800"
        >
          메모 <span className="font-normal text-gray-400">(선택)</span>
        </label>
        <textarea
          id={memoId}
          value={editMemo}
          onChange={(e) => onEditMemo(e.target.value)}
          maxLength={MEMO_MAX}
          rows={3}
          className={`rounded-2xl border px-4 py-2.5 text-sm text-gray-900 transition-colors
            focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/25
            ${memoError ? "border-red-400" : "border-gray-200"}`}
          aria-invalid={memoError ? true : undefined}
        />
        <div className="flex justify-end">
          <p className="text-xs text-gray-400">
            {editMemo.length}/{MEMO_MAX}
          </p>
        </div>
        {memoError ? (
          <p className="text-xs text-red-500" role="alert">
            {memoError}
          </p>
        ) : null}
      </div>

      <TodoPeriodFields
        startsId={startsId}
        endsId={endsId}
        startsValue={editStartsLocal}
        endsValue={editEndsLocal}
        onStartsChange={onEditStarts}
        onEndsChange={onEditEnds}
        error={periodError || undefined}
        disabled={savePending}
      />

      {actionError ? (
        <p className="text-sm text-red-500" role="alert">
          {actionError}
        </p>
      ) : null}

      <div className="flex flex-wrap justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          disabled={savePending}
        >
          취소
        </Button>
        <Button type="submit" size="sm" loading={savePending}>
          저장
        </Button>
      </div>
    </form>
  );
}
