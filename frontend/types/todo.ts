export interface Todo {
  id: string;
  user_id: string;
  title: string;
  memo: string | null;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}
