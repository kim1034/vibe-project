import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "로그인",
  description: "이메일과 비밀번호로 Todo App에 로그인합니다.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const authError =
    error === "auth"
      ? "이메일 인증 링크가 만료되었거나 잘못되었습니다."
      : undefined;

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md rounded-[1.75rem] border border-gray-100 bg-white p-8 shadow-[var(--shadow-taskly-soft)] sm:p-10">
        <LoginForm initialError={authError} />
      </div>
    </main>
  );
}
