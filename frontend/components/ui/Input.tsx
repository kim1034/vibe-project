"use client";

import { InputHTMLAttributes, useId } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({
  label,
  error,
  className = "",
  id: externalId,
  ...rest
}: InputProps) {
  const autoId = useId();
  const id = externalId ?? autoId;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`rounded-lg border px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400
          transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20
          disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500
          ${error ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : "border-gray-300"} ${className}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      />
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
