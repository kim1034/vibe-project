/**
 * Supabase `todos` 목록 조회용 — `Todo` 타입 필드만 선택해 페이로드·직렬화 비용을 제한합니다.
 */
export const TODO_LIST_SELECT =
  "id,user_id,title,memo,is_completed,completed_at,starts_at,ends_at,created_at,updated_at" as const;
