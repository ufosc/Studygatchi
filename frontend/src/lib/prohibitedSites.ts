export type ProhibitedSite = {
  id: number;
  url: string;
};

const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? "" : "http://localhost:8000")
).replace(/\/+$/, "");
const prohibitedSitesUrl = `${apiBaseUrl}/api/prohibited_sites/`;

function isProhibitedSite(value: unknown): value is ProhibitedSite {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "number" &&
    "url" in value &&
    typeof value.url === "string"
  );
}

function getErrorMessage(value: unknown): string | undefined {
  if (typeof value !== "object" || value === null) return undefined;

  if ("detail" in value && typeof value.detail === "string") return value.detail;
  if ("url" in value && Array.isArray(value.url) && typeof value.url[0] === "string") {
    return value.url[0];
  }
  return undefined;
}

function getCsrfToken(): string | undefined {
  const cookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith("csrftoken="));
  return cookie ? decodeURIComponent(cookie.slice("csrftoken=".length)) : undefined;
}

async function parseResponse(response: Response): Promise<unknown> {
  const body = await response.text();
  let data: unknown;

  try {
    data = body ? JSON.parse(body) : null;
  } catch {
    throw new Error(`The server returned an unexpected response (${response.status}).`);
  }

  if (!response.ok) {
    throw new Error(getErrorMessage(data) ?? `Request failed (${response.status}).`);
  }
  return data;
}

export async function getProhibitedSites(signal?: AbortSignal): Promise<ProhibitedSite[]> {
  const response = await fetch(prohibitedSitesUrl, {
    credentials: "include",
    signal,
  });
  const data = await parseResponse(response);
  if (!Array.isArray(data) || !data.every(isProhibitedSite)) {
    throw new Error("The server returned an invalid prohibited-sites list.");
  }
  return data;
}

export async function addProhibitedSite(url: string): Promise<ProhibitedSite> {
  const csrfToken = getCsrfToken();
  if (!csrfToken) {
    throw new Error("Unable to verify this request. Reload the settings page and try again.");
  }

  const response = await fetch(prohibitedSitesUrl, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken,
    },
    body: JSON.stringify({ url }),
  });
  const data = await parseResponse(response);
  if (!isProhibitedSite(data)) {
    throw new Error("The server returned an invalid prohibited-site response.");
  }
  return data;
}
