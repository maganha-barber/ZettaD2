import type { SupabaseClient } from "@supabase/supabase-js";

import type { Task, TaskStatus } from "@/lib/types/task";

type CreateTaskInput = {
  title: string;
  description?: string | null;
  status?: TaskStatus;
};

type UpdateTaskInput = Partial<Pick<Task, "title" | "description" | "status">>;

export class TasksService {
  constructor(private readonly supabase: SupabaseClient) {}

  async listByUser(params: { userId: string; status?: TaskStatus }) {
    const query = this.supabase
      .from("tasks")
      .select("*")
      .eq("user_id", params.userId)
      .order("created_at", { ascending: false });

    if (params.status) query.eq("status", params.status);

    const { data, error } = await query;
    if (error) throw error;

    return data as Task[];
  }

  async createForUser(params: { userId: string; input: CreateTaskInput }) {
    const { data, error } = await this.supabase
      .from("tasks")
      .insert({
        title: params.input.title,
        description: params.input.description ?? null,
        status: params.input.status ?? "pending",
        user_id: params.userId
      })
      .select("*")
      .single();

    if (error) throw error;
    return data as Task;
  }

  async updateByIdForUser(params: {
    userId: string;
    taskId: string;
    patch: UpdateTaskInput;
  }) {
    const { data, error } = await this.supabase
      .from("tasks")
      .update(params.patch)
      .eq("id", params.taskId)
      .eq("user_id", params.userId)
      .select("*")
      .maybeSingle();

    if (error) throw error;
    return (data ?? null) as Task | null;
  }

  async deleteByIdForUser(params: { userId: string; taskId: string }) {
    const { data, error } = await this.supabase
      .from("tasks")
      .delete()
      .eq("id", params.taskId)
      .eq("user_id", params.userId)
      .select("id")
      .maybeSingle();

    if (error) throw error;
    return data ? { id: String(data.id) } : null;
  }
}

