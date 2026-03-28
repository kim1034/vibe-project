import SignupForm from "@/components/auth/SignupForm";

export const metadata = {
  title: "회원가입",
  description: "새 계정을 만들고 할일 관리를 시작합니다.",
};

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <SignupForm />
      </div>
    </main>
  );
}
