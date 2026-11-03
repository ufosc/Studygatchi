import type { ProhibitedSite } from "../types/prohibitedSites";

const API_URL: string =
  import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

export async function getProhibitedSites(): Promise<ProhibitedSite[]> {
  const response = await fetch(`${API_URL}/get_prohibited_sites/`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Loading prohibited sites failed with status ${response.status}`);
  }

  return response.json();
}

export async function removeProhibitedSite(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/remove_prohibited_site/${id}/`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Removing prohibited site failed with status ${response.status}`);
  }
}