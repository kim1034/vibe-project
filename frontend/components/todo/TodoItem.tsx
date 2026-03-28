"use client";

import { FormEvent, useId, useState, useTransition } from "react";
import type { Todo } from "@/types/todo";
import Dialog from "@/components/ui/Dialog";
import TodoItemEditForm from "@/components/todo/TodoItemEditForm";
import TodoItemView from "@/components/todo/TodoItemView";
import {
  datetimeLocalValueToIso,
  formatTodoPeriodLine,
  isoToDatetimeLocalValue,
} from "@/lib/todoPeriod";
import {
  isTodoDraftValid,
  validateTodoDraftFields,
} from "@/lib/todoConstraints";
import {
  deleteTodo,
  toggleTodo,
  updateTodo,
} from "@/app/actions/todo";

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
  const startsId = `${formId}-starts`;
  const endsId = `${formId}-ends`;

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editMemo, setEditMemo] = useState(todo.memo ?? "");
  const [editStartsLocal, setEditStartsLocal] = useState("");
  const [editEndsLocal, setEditEndsLocal] = useState("");
  const [titleError, setTitleError] = useState("");
  const [memoError, setMemoError] = useState("");
  const [periodError, setPeriodError] = useState("");
  const [actionError, setActionError] = useState("");

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [savePending, startSaveTransition] = useTransition();
  const [deletePending, startDeleteTransition] = useTransition();
  const [togglePending, startToggleTransition] = useTransition();

  const completed = todo.is_completed;
  const periodLine = formatTodoPeriodLine(todo);

  function validateEdit(): boolean {
    const errors = validateTodoDraftFields({
      title: editTitle,
      memo: editMemo,
      startsLocal: editStartsLocal,
      endsLocal: editEndsLocal,
    });
    setTitleError(errors.titleError);
    setMemoError(errors.memoError);
    setPeriodError(errors.periodError);
    return isTodoDraftValid(errors);
  }

  function startEdit() {
    setEditTitle(todo.title);
    setEditMemo(todo.memo ?? "");
    setEditStartsLocal(isoToDatetimeLocalValue(todo.starts_at));
    setEditEndsLocal(isoToDatetimeLocalValue(todo.ends_at));
    setTitleError("");
    setMemoError("");
    setPeriodError("");
    setActionError("");
    setIsEditing(true);
  }

  function cancelEdit() {
    setIsEditing(false);
    setTitleError("");
    setMemoError("");
    setPeriodError("");
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
        datetimeLocalValueToIso(editStartsLocal),
        datetimeLocalValueToIso(editEndsLocal),
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

  const doneCard = completed && !isEditing;

  return (
    <article
      className={`rounded-[1.75rem] border p-5 transition-shadow sm:p-6 ${className} ${
        doneCard
          ? "border-amber-200/50 bg-[var(--color-taskly-accent)] shadow-lg shadow-amber-200/25 hover:shadow-xl"
          : "border-gray-100 bg-white shadow-[var(--shadow-taskly-soft)] hover:shadow-[0_28px_56px_-14px_rgba(17,24,39,0.1)]"
      }`}
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
            className={`h-5 w-5 rounded-md focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 ${
              doneCard
                ? "border-white/70 text-amber-600 focus:ring-white/80"
                : "border-gray-300 text-amber-500 focus:ring-amber-400"
            }`}
          />
        </div>

        <div className="min-w-0 flex-1">
          {isEditing ? (
            <TodoItemEditForm
              memoId={memoId}
              startsId={startsId}
              endsId={endsId}
              editTitle={editTitle}
              editMemo={editMemo}
              editStartsLocal={editStartsLocal}
              editEndsLocal={editEndsLocal}
              onEditTitle={setEditTitle}
              onEditMemo={setEditMemo}
              onEditStarts={setEditStartsLocal}
              onEditEnds={setEditEndsLocal}
              titleError={titleError}
              memoError={memoError}
              periodError={periodError}
              actionError={actionError}
              savePending={savePending}
              onSubmit={handleSave}
              onCancel={cancelEdit}
            />
          ) : (
            <TodoItemView
              todo={todo}
              completed={completed}
              periodLine={periodLine}
              onEdit={startEdit}
              onDeleteClick={() => {
                setActionError("");
                setDeleteOpen(true);
              }}
              actionError={actionError}
            />
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
