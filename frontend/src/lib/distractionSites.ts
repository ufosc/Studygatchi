export const PROHIBITED_SITES_KEY = "prohibitedSites";

export const DEFAULT_PROHIBITED_SITES = [
  "facebook.com",
  "instagram.com",
  "reddit.com",
  "tiktok.com",
  "twitch.tv",
  "x.com",
  "youtube.com",
];

export function normalizeSite(value: string): string | null {
  const input = value.trim();
  if (!input) return null;

  try {
    const url = new URL(
      /^[a-zA-Z][a-zA-Z\d+.-]*:\/\//.test(input) ? input : `https://${input}`,
    );
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
}

export function normalizeSites(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return Array.from(
    new Set(
      value
        .filter((site): site is string => typeof site === "string")
        .map(normalizeSite)
        .filter((site): site is string => site !== null),
    ),
  );
}

export function getProhibitedSite(urlValue: string, sites: string[]): string | null {
  try {
    const url = new URL(urlValue);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;

    const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
    return (
      sites.find(
        (site) => hostname === site || hostname.endsWith(`.${site}`),
      ) ?? null
    );
  } catch {
    return null;
  }
}
