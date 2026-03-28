"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { mapNetworkMessage } from "@/lib/mapErrors";
import type { ActionResult } from "@/types/action";

const TITLE_MAX = 200;
const MEMO_MAX = 1000;

function validateTitle(title: string): string | null {
  const trimmed = title.trim();
  if (!trimmed) {
    return "제목을 입력해주세요.";
  }
  if (trimmed.length > TITLE_MAX) {
    return "제목은 200자 이내로 입력해주세요.";
  }
  return null;
}

function validateMemo(memo: string | null | undefined): string | null {
  if (memo == null || memo === "") {
    return null;
  }
  if (memo.length > MEMO_MAX) {
    return "메모는 1000자 이내로 입력해주세요.";
  }
  return null;
}

function normalizeMemo(memo: string | null | undefined): string | null {
  if (memo == null) return null;
  const t = memo.trim();
  return t === "" ? null : t;
}

function mapDbError(message: string): string {
  const network = mapNetworkMessage(message);
  if (network) return network;
  const lower = message.toLowerCase();
  if (
    lower.includes("jwt") ||
    lower.includes("session") ||
    lower.includes("auth")
  ) {
    return "인증이 만료되었습니다. 다시 로그인해주세요.";
  }
  if (lower.includes("permission") || lower.includes("policy")) {
    return "권한이 없습니다.";
  }
  if (
    lower.includes("todos_period_order") ||
    lower.includes("period_order")
  ) {
    return "종료 일시는 시작 일시보다 이후여야 합니다.";
  }
  return "요청을 처리하지 못했습니다. 잠시 후 다시 시도해주세요.";
}

/** ISO 문자열 또는 null. 빈 문자열은 null */
function normalizeInstant(
  value: string | null | undefined,
): string | null | "invalid" {
  if (value == null || value === "") return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "invalid";
  return d.toISOString();
}

function validatePeriodPair(
  startsAt: string | null,
  endsAt: string | null,
): string | null {
  if (startsAt && endsAt) {
    const a = new Date(startsAt).getTime();
    const b = new Date(endsAt).getTime();
    if (b < a) {
      return "종료 일시는 시작 일시보다 이후여야 합니다.";
    }
  }
  return null;
}

export async function createTodo(
  title: string,
  memo?: string | null,
  startsAtIso?: string | null,
  endsAtIso?: string | null,
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "로그인이 필요합니다." };
  }

  const titleErr = validateTitle(title);
  if (titleErr) {
    return { success: false, error: titleErr };
  }

  const memoForDb = normalizeMemo(memo);
  const memoErr = validateMemo(memoForDb ?? undefined);
  if (memoErr) {
    return { success: false, error: memoErr };
  }

  const startsNorm = normalizeInstant(startsAtIso ?? null);
  const endsNorm = normalizeInstant(endsAtIso ?? null);
  if (startsNorm === "invalid" || endsNorm === "invalid") {
    return { success: false, error: "날짜·시간 형식이 올바르지 않습니다." };
  }

  const periodErr = validatePeriodPair(startsNorm, endsNorm);
  if (periodErr) {
    return { success: false, error: periodErr };
  }

  const trimmedTitle = title.trim();

  const { error } = await supabase.from("todos").insert({
    user_id: user.id,
    title: trimmedTitle,
    memo: memoForDb,
    starts_at: startsNorm,
    ends_at: endsNorm,
  });

  if (error) {
    return { success: false, error: mapDbError(error.message) };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateTodo(
  id: string,
  title: string,
  memo?: string | null,
  startsAtIso?: string | null,
  endsAtIso?: string | null,
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "로그인이 필요합니다." };
  }

  if (!id?.trim()) {
    return { success: false, error: "할 일을 찾을 수 없습니다." };
  }

  const titleErr = validateTitle(title);
  if (titleErr) {
    return { success: false, error: titleErr };
  }

  const memoForDb = normalizeMemo(memo);
  const memoErr = validateMemo(memoForDb ?? undefined);
  if (memoErr) {
    return { success: false, error: memoErr };
  }

  const startsNorm = normalizeInstant(startsAtIso ?? null);
  const endsNorm = normalizeInstant(endsAtIso ?? null);
  if (startsNorm === "invalid" || endsNorm === "invalid") {
    return { success: false, error: "날짜·시간 형식이 올바르지 않습니다." };
  }

  const periodErr = validatePeriodPair(startsNorm, endsNorm);
  if (periodErr) {
    return { success: false, error: periodErr };
  }

  const trimmedTitle = title.trim();

  const { data, error } = await supabase
    .from("todos")
    .update({
      title: trimmedTitle,
      memo: memoForDb,
      starts_at: startsNorm,
      ends_at: endsNorm,
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id");

  if (error) {
    return { success: false, error: mapDbError(error.message) };
  }
  if (!data?.length) {
    return { success: false, error: "수정 권한이 없거나 항목을 찾을 수 없습니다." };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function toggleTodo(
  id: string,
  is_completed: boolean,
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "로그인이 필요합니다." };
  }

  if (!id?.trim()) {
    return { success: false, error: "할 일을 찾을 수 없습니다." };
  }

  const { data, error } = await supabase
    .from("todos")
    .update({
      is_completed,
      completed_at: is_completed ? new Date().toISOString() : null,
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id");

  if (error) {
    return { success: false, error: mapDbError(error.message) };
  }
  if (!data?.length) {
    return { success: false, error: "수정 권한이 없거나 항목을 찾을 수 없습니다." };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteTodo(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "로그인이 필요합니다." };
  }

  if (!id?.trim()) {
    return { success: false, error: "할 일을 찾을 수 없습니다." };
  }

  const { data, error } = await supabase
    .from("todos")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id");

  if (error) {
    return { success: false, error: mapDbError(error.message) };
  }
  if (!data?.length) {
    return { success: false, error: "삭제에 실패했습니다." };
  }

  revalidatePath("/dashboard");
  return { success: true };
}
