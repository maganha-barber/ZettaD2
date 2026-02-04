export type TaskStatus = "pending" | "done";

export interface Task {
  id: string;
  created_at: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  user_id: string;
}

