/**
 * Supabase `todos` 테이블 행과 동일한 필드명(snake_case)을 씁니다.
 * UI 전용 camelCase DTO가 필요하면 이 타입에서 매핑하는 레이어를 둡니다.
 */
export interface Todo {
  id: string;
  user_id: string;
  title: string;
  memo: string | null;
  is_completed: boolean;
  /** 완료로 체크된 시각. 미완료면 null */
  completed_at: string | null;
  /** 기간 시작(선택). 로컬 입력은 서버에서 UTC ISO로 저장 */
  starts_at: string | null;
  /** 기간 종료·마감(선택) */
  ends_at: string | null;
  created_at: string;
  updated_at: string;
}
