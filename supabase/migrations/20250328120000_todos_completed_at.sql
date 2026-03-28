-- 완료 시각 기록 (날짜별로 완료한 할일 조회용)
ALTER TABLE public.todos
  ADD COLUMN IF NOT EXISTS completed_at timestamptz NULL;

-- 기존 완료 항목: 마지막 수정 시각을 완료일 근사값으로 사용
UPDATE public.todos
SET completed_at = updated_at
WHERE is_completed = true AND completed_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_todos_user_completed_at
  ON public.todos (user_id, completed_at DESC)
  WHERE completed_at IS NOT NULL;
