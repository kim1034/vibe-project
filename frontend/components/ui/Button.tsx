"use client";

import { ButtonHTMLAttributes, Ref } from "react";

type ButtonVariant = "primary" | "danger" | "ghost";
type ButtonSize = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  ref?: Ref<HTMLButtonElement>;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--color-taskly-accent)] text-gray-900 hover:bg-[var(--color-taskly-accent-hover)] focus-visible:ring-amber-400 disabled:bg-amber-200/80 disabled:text-gray-500",
  danger:
    "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-400 disabled:bg-red-300",
  ghost:
    "bg-transparent text-gray-600 hover:bg-gray-100/90 focus-visible:ring-amber-300/80 disabled:text-gray-400",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  children,
  className = "",
  ref,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      ref={ref}
      type={type}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...rest}
    >
      {loading && (
        <svg
          className="h-4 w-4 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
