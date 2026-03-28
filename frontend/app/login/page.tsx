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
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <LoginForm initialError={authError} />
      </div>
    </main>
  );
}
