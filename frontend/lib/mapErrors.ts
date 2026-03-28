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

function matchesAuthError(lower: string): boolean {
  return (
    lower.includes("jwt") ||
    lower.includes("session") ||
    lower.includes("auth")
  );
}

function matchesRlsError(lower: string): boolean {
  return (
    lower.includes("permission") ||
    lower.includes("policy") ||
    lower.includes("rls") ||
    lower.includes("row-level")
  );
}

/** PostgREST·스키마·컬럼·테이블 불일치 등 (민감한 원문은 UI에 그대로 쓰지 않음) */
function matchesSchemaOrApiError(lower: string): boolean {
  return (
    lower.includes("pgrst") ||
    lower.includes("postgrest") ||
    lower.includes("relation") ||
    lower.includes("column") ||
    lower.includes("schema cache") ||
    (lower.includes("schema") && lower.includes("cache")) ||
    lower.includes("syntax") ||
    lower.includes("does not exist") ||
    lower.includes("could not find")
  );
}

/**
 * 서버 액션(insert/update/delete) 실패 시 사용자용 문구.
 * 스키마 불일치(미적용 마이그레이션 등)는 구체적 안내, 기술 스택·쿼리 원문은 노출하지 않음.
 */
export function mapSupabaseMutationError(message: string): string {
  const network = mapNetworkMessage(message);
  if (network) return network;
  const lower = message.toLowerCase();
  if (matchesAuthError(lower)) {
    return "인증이 만료되었습니다. 다시 로그인해주세요.";
  }
  if (matchesRlsError(lower)) {
    return "권한이 없습니다.";
  }
  if (
    lower.includes("todos_period_order") ||
    lower.includes("period_order")
  ) {
    return "종료 일시는 시작 일시보다 이후여야 합니다.";
  }
  if (matchesSchemaOrApiError(lower)) {
    return "저장할 수 없습니다. Supabase에 최신 마이그레이션이 적용됐는지 확인해주세요.";
  }
  if (lower.includes("unique") || lower.includes("duplicate")) {
    return "같은 조건의 데이터가 이미 있을 수 있습니다. 잠시 후 다시 시도해주세요.";
  }
  return "요청을 처리하지 못했습니다. 잠시 후 다시 시도해주세요.";
}

/** 서버 컴포넌트·에러 경계에 노출된 기술 메시지를 사용자용으로 다듬습니다. */
export function formatDataLoadErrorMessage(raw: string): string {
  const network = mapNetworkMessage(raw);
  if (network) return network;
  const lower = raw.toLowerCase();
  if (matchesAuthError(lower)) {
    return "인증이 만료되었습니다. 다시 로그인해주세요.";
  }
  if (matchesRlsError(lower)) {
    return "데이터에 접근할 권한이 없습니다.";
  }
  if (matchesSchemaOrApiError(lower)) {
    return "할일을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.";
  }
  return raw.length > 120
    ? "할일을 불러오지 못했습니다. 잠시 후 다시 시도해주세요."
    : raw;
}
