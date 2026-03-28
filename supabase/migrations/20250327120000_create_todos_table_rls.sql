-- Todos table: id, user_id, title, memo, is_completed, created_at, updated_at
-- RLS: authenticated users may only access rows where auth.uid() = user_id

CREATE TABLE public.todos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  title text NOT NULL,
  memo text,
  is_completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_todos_user_id ON public.todos (user_id);
CREATE INDEX idx_todos_user_created ON public.todos (user_id, created_at DESC);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER todos_set_updated_at
  BEFORE UPDATE ON public.todos
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "todos_select_own"
  ON public.todos
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "todos_insert_own"
  ON public.todos
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "todos_update_own"
  ON public.todos
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "todos_delete_own"
  ON public.todos
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
