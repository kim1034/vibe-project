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

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader email={user.email ?? null} />
      <main className="mx-auto w-full max-w-2xl px-4 py-6 lg:px-6">
        {children}
      </main>
    </div>
  );
}
