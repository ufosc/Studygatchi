import type { TaskFields } from "../types/task";

const API_URL: string =
  import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

export async function updateTask(
  id: number,
  changes: Partial<TaskFields>
): Promise<TaskFields> {
  const response = await fetch(`${API_URL}/update_task/${id}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(changes),
  });

  if (!response.ok) {
    throw new Error(`Update failed with status ${response.status}`);
  }

  return response.json();
}