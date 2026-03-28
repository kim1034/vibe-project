import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export const metadata: Metadata = {
  title: "대시보드",
  description: "할일을 추가하고 필터링하며 완료 상태를 관리합니다.",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const email = user.email ?? "";
  const initial = email ? email.trim().charAt(0).toUpperCase() : "?";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto grid max-w-[1600px] gap-6 px-4 py-6 sm:px-6 lg:gap-8 lg:px-8 lg:py-8 xl:grid-cols-12">
        <aside
          className="hidden flex-col gap-6 xl:col-span-3 xl:flex"
          aria-label="요약 및 캘린더"
        >
          <div className="rounded-[1.75rem] border border-gray-100 bg-white p-6 shadow-[var(--shadow-taskly-soft)]">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Todo App
            </p>
            <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
              오늘의{" "}
              <span className="text-[var(--color-taskly-accent)]">할일</span>
            </p>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              집중할 작업을 정리하고 한 번에 처리해 보세요.
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-gray-100 bg-white p-6 shadow-[var(--shadow-taskly-soft)]">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900">이번 주</h2>
              <span
                className="rounded-full bg-[var(--color-taskly-accent)]/25 px-3 py-1 text-xs font-semibold text-gray-800"
                aria-hidden
              >
                Pin
              </span>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              중요한 할일을 상단에 고정해 두면 매일 한눈에 볼 수 있어요.
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-gray-100 bg-white p-6 shadow-[var(--shadow-taskly-soft)]">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              오늘
            </p>
            <p className="mt-2 flex flex-wrap items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">토요일</span>
              <span className="flex h-11 min-w-11 items-center justify-center rounded-full bg-[var(--color-taskly-accent)] px-3 text-lg font-bold text-gray-900 shadow-sm">
                28
              </span>
            </p>
            <p className="mt-2 text-sm text-gray-500">2026년 3월</p>
            <div
              className="mt-5 grid grid-cols-7 gap-1.5 text-center text-[11px] font-medium text-gray-400"
              aria-hidden
            >
              {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
                <span key={d}>{d}</span>
              ))}
              {Array.from({ length: 35 }, (_, slot) => {
                const day = slot < 31 ? slot + 1 : null;
                const isToday = day === 28;
                return (
                  <span
                    key={slot}
                    className={`flex h-8 items-center justify-center rounded-full text-sm text-gray-600 ${
                      day === null ? "text-transparent" : ""
                    } ${isToday ? "bg-[var(--color-taskly-accent)] font-semibold text-gray-900 shadow-sm" : ""}`}
                  >
                    {day ?? "·"}
                  </span>
                );
              })}
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-col gap-6 xl:col-span-6">
          <DashboardHeader email={user.email ?? null} />
          <main className="w-full">{children}</main>
        </div>

        <aside
          className="hidden flex-col gap-6 xl:col-span-3 xl:flex"
          aria-label="프로필 및 위젯"
        >
          <div className="rounded-[1.75rem] border border-gray-100 bg-white p-6 shadow-[var(--shadow-taskly-soft)]">
            <div className="flex items-center gap-4">
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-taskly-accent)] text-xl font-bold text-gray-900 shadow-inner"
                aria-hidden
              >
                {initial}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  로그인 중
                </p>
                <p
                  className="truncate text-sm font-semibold text-gray-900"
                  title={email || undefined}
                >
                  {email || "계정"}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-[1.75rem] border border-gray-100 bg-white p-5 shadow-[var(--shadow-taskly-soft)]">
            <div className="flex items-center gap-3">
              <div
                className="h-12 w-12 shrink-0 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200"
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-gray-900">
                  집중 플레이리스트
                </p>
                <p className="text-xs text-gray-500">오늘 할일에 맞는 BGM</p>
              </div>
            </div>
            <div
              className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-gray-100"
              aria-hidden
            >
              <div className="h-full w-2/5 rounded-full bg-[var(--color-taskly-accent)]" />
            </div>
            <div className="mt-3 flex justify-center gap-4 text-gray-400">
              <span className="text-lg" aria-hidden>
                ◀
              </span>
              <span className="text-lg text-gray-900" aria-hidden>
                ▶
              </span>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[1.75rem] border border-amber-100/80 bg-gradient-to-br from-[var(--color-taskly-accent)]/35 via-white to-amber-50 p-6 shadow-[var(--shadow-taskly-soft)]">
            <p className="relative z-10 text-sm font-semibold text-gray-900">
              한 번에 하나씩
            </p>
            <p className="relative z-10 mt-2 text-sm leading-relaxed text-gray-600">
              작은 완료가 쌓이면 하루가 가벼워져요.
            </p>
            <div
              className="pointer-events-none absolute -bottom-6 -right-6 h-28 w-28 rounded-full bg-[var(--color-taskly-accent)]/40 blur-2xl"
              aria-hidden
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
