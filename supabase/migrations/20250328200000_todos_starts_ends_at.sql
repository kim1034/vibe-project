-- 기간: 시작·종료 시각 (선택, timestamptz). 둘 다 비우면 기간 없음.
-- 종료가 시작보다 이르면 DB에서 거절 (애플리케이션에서도 검증)

ALTER TABLE public.todos
  ADD COLUMN IF NOT EXISTS starts_at timestamptz NULL,
  ADD COLUMN IF NOT EXISTS ends_at timestamptz NULL;

ALTER TABLE public.todos
  DROP CONSTRAINT IF EXISTS todos_period_order;

ALTER TABLE public.todos
  ADD CONSTRAINT todos_period_order CHECK (
    starts_at IS NULL
    OR ends_at IS NULL
    OR ends_at >= starts_at
  );

CREATE INDEX IF NOT EXISTS idx_todos_user_ends_at
  ON public.todos (user_id, ends_at ASC NULLS LAST);

CREATE INDEX IF NOT EXISTS idx_todos_user_starts_at
  ON public.todos (user_id, starts_at ASC NULLS LAST);
