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
      className="border-b border-gray-200 bg-white"
      role="banner"
    >
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
        <h1 className="text-lg font-bold text-gray-900">Todo App</h1>

        <div className="flex items-center gap-3">
          {email && (
            <span
              className="hidden text-sm text-gray-500 sm:inline"
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
