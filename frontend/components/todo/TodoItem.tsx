"use client";

import { FormEvent, useId, useState, useTransition } from "react";
import { Todo } from "@/types/todo";
import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";
import Input from "@/components/ui/Input";
import {
  deleteTodo,
  toggleTodo,
  updateTodo,
} from "@/app/actions/todo";

const TITLE_MAX = 200;
const MEMO_MAX = 1000;

interface TodoItemProps {
  todo: Todo;
  /** 토글·수정·삭제 후 부모에서 목록을 갱신할 때 호출 */
  onChanged?: () => void;
  className?: string;
}

export default function TodoItem({
  todo,
  onChanged,
  className = "",
}: TodoItemProps) {
  const formId = useId();
  const memoId = `${formId}-memo`;

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editMemo, setEditMemo] = useState(todo.memo ?? "");
  const [titleError, setTitleError] = useState("");
  const [memoError, setMemoError] = useState("");
  const [actionError, setActionError] = useState("");

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [savePending, startSaveTransition] = useTransition();
  const [deletePending, startDeleteTransition] = useTransition();
  const [togglePending, startToggleTransition] = useTransition();

  const completed = todo.is_completed;

  function validateEdit(): boolean {
    const trimmed = editTitle.trim();
    let ok = true;
    setTitleError("");
    setMemoError("");

    if (!trimmed) {
      setTitleError("제목을 입력해주세요.");
      ok = false;
    } else if (trimmed.length > TITLE_MAX) {
      setTitleError(`제목은 ${TITLE_MAX}자 이내로 입력해주세요.`);
      ok = false;
    }

    if (editMemo.length > MEMO_MAX) {
      setMemoError(`메모는 ${MEMO_MAX}자 이내로 입력해주세요.`);
      ok = false;
    }

    return ok;
  }

  function startEdit() {
    setEditTitle(todo.title);
    setEditMemo(todo.memo ?? "");
    setTitleError("");
    setMemoError("");
    setActionError("");
    setIsEditing(true);
  }

  function cancelEdit() {
    setIsEditing(false);
    setTitleError("");
    setMemoError("");
    setActionError("");
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setActionError("");
    if (!validateEdit()) return;

    startSaveTransition(async () => {
      const result = await updateTodo(
        todo.id,
        editTitle,
        editMemo.trim() ? editMemo : undefined,
      );
      if (!result.success) {
        setActionError(result.error);
        return;
      }
      setIsEditing(false);
      onChanged?.();
    });
  }

  async function handleToggle() {
    if (isEditing) return;
    setActionError("");
    startToggleTransition(async () => {
      const result = await toggleTodo(todo.id, !todo.is_completed);
      if (!result.success) {
        setActionError(result.error);
        return;
      }
      onChanged?.();
    });
  }

  async function handleDeleteConfirm() {
    startDeleteTransition(async () => {
      const result = await deleteTodo(todo.id);
      if (!result.success) {
        setActionError(result.error);
        setDeleteOpen(false);
        return;
      }
      setDeleteOpen(false);
      onChanged?.();
    });
  }

  return (
    <article
      className={`rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md ${className}`}
    >
      <div className="flex gap-3">
        <div className="mt-0.5 shrink-0">
          <label className="sr-only" htmlFor={`${formId}-done`}>
            완료 여부
          </label>
          <input
            id={`${formId}-done`}
            type="checkbox"
            checked={todo.is_completed}
            onChange={handleToggle}
            disabled={isEditing || togglePending}
            aria-label={`${todo.title} 완료로 표시`}
            className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="min-w-0 flex-1">
          {isEditing ? (
            <form onSubmit={handleSave} className="flex flex-col gap-4" noValidate>
              <Input
                label="제목"
                required
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
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
                  className="text-sm font-medium text-gray-700"
                >
                  메모 <span className="font-normal text-gray-400">(선택)</span>
                </label>
                <textarea
                  id={memoId}
                  value={editMemo}
                  onChange={(e) => setEditMemo(e.target.value)}
                  maxLength={MEMO_MAX}
                  rows={3}
                  className={`rounded-lg border px-3 py-2 text-sm text-gray-900 transition-colors
                    focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20
                    ${memoError ? "border-red-400" : "border-gray-300"}`}
                  aria-invalid={memoError ? true : undefined}
                />
                <div className="flex justify-end">
                  <p className="text-xs text-gray-400">{editMemo.length}/{MEMO_MAX}</p>
                </div>
                {memoError ? (
                  <p className="text-xs text-red-500" role="alert">
                    {memoError}
                  </p>
                ) : null}
              </div>

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
                  onClick={cancelEdit}
                  disabled={savePending}
                >
                  취소
                </Button>
                <Button type="submit" size="sm" loading={savePending}>
                  저장
                </Button>
              </div>
            </form>
          ) : (
            <>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h3
                    className={`text-base font-medium ${
                      completed ? "text-gray-400 line-through" : "text-gray-900"
                    }`}
                  >
                    {todo.title}
                  </h3>
                  {todo.memo ? (
                    <p
                      className={`mt-1 whitespace-pre-wrap text-sm ${
                        completed ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {todo.memo}
                    </p>
                  ) : null}
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={startEdit}
                    aria-label="할일 수정"
                  >
                    수정
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      setActionError("");
                      setDeleteOpen(true);
                    }}
                    aria-label="할일 삭제"
                  >
                    삭제
                  </Button>
                </div>
              </div>
              {actionError ? (
                <p className="mt-2 text-sm text-red-500" role="alert">
                  {actionError}
                </p>
              ) : null}
            </>
          )}
        </div>
      </div>

      <Dialog
        open={deleteOpen}
        title="할일 삭제"
        message="이 할일을 삭제할까요? 삭제하면 되돌릴 수 없습니다."
        confirmLabel="삭제"
        cancelLabel="취소"
        variant="danger"
        loading={deletePending}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteOpen(false);
        }}
      />
    </article>
  );
}
