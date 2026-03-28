"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { login } from "@/app/actions/auth";

export default function LoginForm({
  initialError,
}: {
  initialError?: string;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(initialError ?? "");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(email, password);
      if (!result.success) {
        setError(result.error);
        return;
      }
      router.refresh();
      router.push("/dashboard");
    } catch {
      setError(
        "요청을 처리하지 못했습니다. 네트워크 상태를 확인한 뒤 다시 시도해주세요.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
      <div className="mb-2 text-center">
        <h1 className="text-2xl font-bold text-gray-900">로그인</h1>
        <p className="mt-1 text-sm text-gray-500">
          계정에 로그인하여 할일을 관리하세요
        </p>
      </div>

      <Input
        label="이메일"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
      />

      <Input
        label="비밀번호"
        type="password"
        placeholder="6자 이상 입력"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={6}
        autoComplete="current-password"
      />

      {error && (
        <p className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" loading={loading} className="mt-1 w-full">
        로그인
      </Button>

      <p className="text-center text-sm text-gray-500">
        계정이 없으신가요?{" "}
        <Link
          href="/signup"
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          회원가입
        </Link>
      </p>
    </form>
  );
}
