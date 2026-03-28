import SignupForm from "@/components/auth/SignupForm";

export const metadata = {
  title: "회원가입",
  description: "새 계정을 만들고 할일 관리를 시작합니다.",
};

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md rounded-[1.75rem] border border-gray-100 bg-white p-8 shadow-[var(--shadow-taskly-soft)] sm:p-10">
        <SignupForm />
      </div>
    </main>
  );
}
