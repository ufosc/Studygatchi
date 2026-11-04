const defaultProhibitedSites = [
  "facebook.com",
  "instagram.com",
  "reddit.com",
  "tiktok.com",
  "twitch.tv",
  "x.com",
  "youtube.com",
];
const prohibitedSitesKey = "prohibitedSites";

function getProhibitedSite(urlValue: string, sites: unknown): string | null {
  let hostname: string;
  try {
    const url = new URL(urlValue);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    hostname = url.hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }

  if (!Array.isArray(sites)) return null;
  return (
    sites.find(
      (site): site is string =>
        typeof site === "string" &&
        (hostname === site || hostname.endsWith(`.${site}`)),
    ) ?? null
  );
}

function showWarning(site: string) {
  if (document.getElementById("studygatchi-focus-warning")) return;

  const host = document.createElement("div");
  host.id = "studygatchi-focus-warning";
  const shadow = host.attachShadow({ mode: "closed" });
  const style = document.createElement("style");
  style.textContent = `
    :host { all: initial; position: fixed; inset: 0; z-index: 2147483647; }
    .backdrop {
      position: fixed; inset: 0; display: grid; place-items: center;
      padding: 20px; box-sizing: border-box;
      background: rgba(15, 20, 32, .62);
      font: 16px/1.5 system-ui, sans-serif;
    }
    .dialog {
      width: min(440px, 100%); box-sizing: border-box; padding: 28px;
      border: 1px solid #d5d9e2; border-radius: 16px;
      background: #fff; color: #202534; text-align: center;
      box-shadow: 0 18px 60px rgba(0, 0, 0, .35);
    }
    h2 { margin: 0 0 10px; font-size: 24px; }
    p { margin: 0 0 20px; }
    button {
      border: 0; border-radius: 8px; padding: 11px 18px;
      background: #7057d9; color: #fff; font: inherit; font-weight: 650;
      cursor: pointer;
    }
    button:focus-visible { outline: 3px solid #2d66d5; outline-offset: 3px; }
  `;

  const backdrop = document.createElement("div");
  backdrop.className = "backdrop";
  backdrop.innerHTML = `
    <section class="dialog" role="alertdialog" aria-modal="true"
      aria-labelledby="studygatchi-warning-title"
      aria-describedby="studygatchi-warning-message">
      <h2 id="studygatchi-warning-title">Time to refocus</h2>
      <p id="studygatchi-warning-message">
        ${site} is on your distraction list. Take a breath and head back to your task.
      </p>
      <button type="button">Return to my task</button>
    </section>
  `;

  backdrop.querySelector("button")?.addEventListener("click", () => host.remove());
  shadow.append(style, backdrop);
  document.documentElement.append(host);
  backdrop.querySelector("button")?.focus();
}

async function checkCurrentSite() {
  const currentSite = getProhibitedSite(location.href, defaultProhibitedSites);
  if (!currentSite) return;

  try {
    const stored = await chrome.storage.local.get(prohibitedSitesKey);
    const sites =
      stored[prohibitedSitesKey] === undefined
        ? defaultProhibitedSites
        : stored[prohibitedSitesKey];
    const prohibitedSite = getProhibitedSite(location.href, sites);
    if (prohibitedSite) showWarning(prohibitedSite);
  } catch (error) {
    console.error("Could not check the current site against your list:", error);
  }
}

void checkCurrentSite();
