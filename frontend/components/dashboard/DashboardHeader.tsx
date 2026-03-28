"use client";

import { useFormStatus } from "react-dom";
import Button from "@/components/ui/Button";
import { logout } from "@/app/actions/auth";

function LogoutSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="ghost" size="sm" loading={pending}>
      로그아웃
    </Button>
  );
}

export default function DashboardHeader({
  email,
}: {
  email: string | null;
}) {
  return (
    <header
      className="rounded-[1.75rem] border border-gray-100 bg-white px-5 py-4 shadow-[var(--shadow-taskly-soft)]"
      role="banner"
    >
      <div className="flex w-full items-center justify-between gap-4">
        <h1 className="text-lg font-bold tracking-tight text-gray-900">
          대시보드
        </h1>

        <div className="flex items-center gap-3">
          {email && (
            <span
              className="hidden max-w-[200px] truncate rounded-full border border-gray-100 bg-gray-50/80 px-3 py-1 text-xs font-medium text-gray-500 sm:inline"
              title={email}
            >
              {email}
            </span>
          )}
          <form action={logout}>
            <LogoutSubmitButton />
          </form>
        </div>
      </div>
    </header>
  );
}
