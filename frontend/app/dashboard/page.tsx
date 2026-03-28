import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardTodoClient from "@/components/dashboard/DashboardTodoClient";
import type { Todo } from "@/types/todo";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: rows, error } = await supabase
    .from("todos")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const todos: Todo[] = (rows ?? []).map((row) => {
    const r = row as Todo;
    return {
      ...r,
      completed_at: r.completed_at ?? null,
    };
  });

  return <DashboardTodoClient initialTodos={todos} />;
}
