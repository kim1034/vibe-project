export interface Todo {
  id: string;
  user_id: string;
  title: string;
  memo: string | null;
  is_completed: boolean;
  /** 완료로 체크된 시각. 미완료면 null */
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}
