/**
 * Supabase/Postgres 클라이언트 메시지를 사용자용 한국어 문구로 정리합니다.
 */

export function mapNetworkMessage(message: string): string | null {
  const lower = message.toLowerCase();
  if (
    lower.includes("fetch") ||
    lower.includes("network") ||
    lower.includes("failed to fetch") ||
    lower.includes("load failed") ||
    lower.includes("econnrefused") ||
    lower.includes("econnreset") ||
    lower.includes("enotfound") ||
    lower.includes("timeout") ||
    lower.includes("timed out") ||
    lower.includes("socket")
  ) {
    return "네트워크 연결을 확인한 뒤 다시 시도해주세요.";
  }
  return null;
}

/** 서버 컴포넌트·에러 경계에 노출된 기술 메시지를 사용자용으로 다듬습니다. */
export function formatDataLoadErrorMessage(raw: string): string {
  const network = mapNetworkMessage(raw);
  if (network) return network;
  const lower = raw.toLowerCase();
  if (
    lower.includes("jwt") ||
    lower.includes("session") ||
    lower.includes("auth")
  ) {
    return "인증이 만료되었습니다. 다시 로그인해주세요.";
  }
  if (
    lower.includes("permission") ||
    lower.includes("policy") ||
    lower.includes("rls") ||
    lower.includes("row-level")
  ) {
    return "데이터에 접근할 권한이 없습니다.";
  }
  if (
    lower.includes("pgrst") ||
    lower.includes("relation") ||
    lower.includes("column") ||
    lower.includes("syntax")
  ) {
    return "할일을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.";
  }
  return raw.length > 120
    ? "할일을 불러오지 못했습니다. 잠시 후 다시 시도해주세요."
    : raw;
}
