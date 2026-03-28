"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { mapNetworkMessage } from "@/lib/mapErrors";
import type { ActionResult } from "@/types/action";

function mapAuthError(message: string): string {
  const network = mapNetworkMessage(message);
  if (network) return network;
  const lower = message.toLowerCase();
  if (
    lower.includes("invalid login credentials") ||
    lower.includes("invalid credentials")
  ) {
    return "이메일 또는 비밀번호가 올바르지 않습니다.";
  }
  if (lower.includes("email not confirmed")) {
    return "이메일 인증을 완료한 뒤 다시 시도해주세요.";
  }
  if (lower.includes("user already registered")) {
    return "이미 등록된 이메일입니다.";
  }
  if (lower.includes("password")) {
    return message;
  }
  if (lower.includes("rate limit") || lower.includes("too many")) {
    return "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.";
  }
  if (lower.includes("service") && lower.includes("unavailable")) {
    return "서비스에 일시적으로 연결할 수 없습니다. 잠시 후 다시 시도해주세요.";
  }
  return message;
}

function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}

export async function login(
  email: string,
  password: string,
): Promise<ActionResult> {
  const trimmedEmail = email.trim();
  if (!trimmedEmail) {
    return { success: false, error: "이메일을 입력해주세요." };
  }
  if (password.length < 6) {
    return { success: false, error: "비밀번호는 6자 이상이어야 합니다." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: trimmedEmail,
    password,
  });

  if (error) {
    return { success: false, error: mapAuthError(error.message) };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function signup(
  email: string,
  password: string,
): Promise<ActionResult> {
  const trimmedEmail = email.trim();
  if (!trimmedEmail || !trimmedEmail.includes("@")) {
    return { success: false, error: "올바른 이메일 주소를 입력해주세요." };
  }
  if (password.length < 6) {
    return { success: false, error: "비밀번호는 6자 이상이어야 합니다." };
  }

  const supabase = await createClient();
  const origin = siteUrl();
  const { error } = await supabase.auth.signUp({
    email: trimmedEmail,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return { success: false, error: mapAuthError(error.message) };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
