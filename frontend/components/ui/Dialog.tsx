"use client";

import { useEffect, useId, useRef } from "react";
import Button from "./Button";

interface DialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "primary" | "danger";
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function Dialog({
  open,
  title,
  message,
  confirmLabel = "확인",
  cancelLabel = "취소",
  variant = "primary",
  loading = false,
  onConfirm,
  onCancel,
}: DialogProps) {
  const titleId = useId();
  const messageId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;

    if (open && !el.open) {
      el.showModal();
      cancelButtonRef.current?.focus();
    } else if (!open && el.open) {
      el.close();
    }
  }, [open]);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;

    const handleCancel = (e: Event) => {
      e.preventDefault();
      onCancel();
    };
    el.addEventListener("cancel", handleCancel);
    return () => el.removeEventListener("cancel", handleCancel);
  }, [onCancel]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={messageId}
      className="w-full max-w-sm rounded-[1.5rem] border border-gray-100 bg-white p-0 shadow-[var(--shadow-taskly-soft)] backdrop:bg-gray-900/35"
    >
      <div className="p-8">
        <h2 id={titleId} className="text-xl font-bold tracking-tight text-gray-900">
          {title}
        </h2>
        <p id={messageId} className="mt-3 text-sm leading-relaxed text-gray-500">
          {message}
        </p>
      </div>

      <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-5">
        <Button
          ref={cancelButtonRef}
          variant="ghost"
          size="sm"
          onClick={onCancel}
          disabled={loading}
        >
          {cancelLabel}
        </Button>
        <Button
          variant={variant === "danger" ? "danger" : "primary"}
          size="sm"
          loading={loading}
          onClick={onConfirm}
        >
          {confirmLabel}
        </Button>
      </div>
    </dialog>
  );
}
