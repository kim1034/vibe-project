"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { signup } from "@/app/actions/auth";

export default function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);

    try {
      const result = await signup(email, password);
      if (!result.success) {
        setError(result.error);
        return;
      }
      router.refresh();
      router.push("/login");
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
        <h1 className="text-2xl font-bold text-gray-900">회원가입</h1>
        <p className="mt-1 text-sm text-gray-500">
          새 계정을 만들어 할일 관리를 시작하세요
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
        autoComplete="new-password"
      />

      <Input
        label="비밀번호 확인"
        type="password"
        placeholder="비밀번호를 다시 입력"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        minLength={6}
        autoComplete="new-password"
      />

      {error && (
        <p className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" loading={loading} className="mt-1 w-full">
        회원가입
      </Button>

      <p className="text-center text-sm text-gray-500">
        이미 계정이 있으신가요?{" "}
        <Link
          href="/login"
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          로그인
        </Link>
      </p>
    </form>
  );
}
