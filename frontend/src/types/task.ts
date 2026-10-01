export interface Task {
  id: number;
  name: string;
  description: string;
  category: string;
  due_date: string; // ISO date string
  reward: number;   // coins ,0-100
  completed: boolean;
}

export type TaskFields = Pick<
  Task,
  "name" | "description" | "category" | "due_date" | "reward"
>;