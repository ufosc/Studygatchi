const DEFAULT_HEALTH = 50;
const DAMAGE_PER_VISIT = 10;
const DEFAULT_PROHIBITED_SITES = [
  "youtube.com",
  "instagram.com",
  "x.com",
  "facebook.com",
];

const bypassedNavigationByTab = new Map<number, string>();

type ExtensionState = {
  timerRunning?: boolean;
  prohibitedSites?: string[];
  gooberHealth?: number;
};

const normalizeSite = (site: string): string | null => {
  try {
    const url = new URL(site.includes("://") ? site : `https://${site}`);
    return url.hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
};

const isProhibited = (url: string, prohibitedSites: string[]): string | null => {
  let hostname: string;
  try {
    hostname = new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }

  return prohibitedSites.find((site) => {
    const normalizedSite = normalizeSite(site);
    return normalizedSite !== null &&
      (normalizedSite === hostname || hostname.endsWith(`.${normalizedSite}`));
  }) ?? null;
};

const applyDamage = async (site: string) => {
  const state = await chrome.storage.local.get<ExtensionState>("gooberHealth");
  const health = Math.max(0, (state.gooberHealth ?? DEFAULT_HEALTH) - DAMAGE_PER_VISIT);
  await chrome.storage.local.set({ gooberHealth: health });
  chrome.runtime.sendMessage({
    type: "GOOBER_DAMAGED",
    health,
    site,
  }).catch(() => undefined);
};

const damageForTab = async (tab: chrome.tabs.Tab) => {
  if (!tab.url || tab.url.startsWith("chrome://")) return;
  if (tab.url.startsWith(chrome.runtime.getURL("warning.html"))) return;

  const state = await chrome.storage.local.get<ExtensionState>([
    "timerRunning",
    "prohibitedSites",
    "gooberHealth",
  ]);
  if (!state.timerRunning) return;

  const prohibitedSite = isProhibited(tab.url, state.prohibitedSites ?? []);
  if (!prohibitedSite) return;

  if (tab.id !== undefined && bypassedNavigationByTab.get(tab.id) === tab.url) {
    bypassedNavigationByTab.delete(tab.id);
    return;
  }

  const warningUrl = `${chrome.runtime.getURL("warning.html")}?site=${encodeURIComponent(
    prohibitedSite,
  )}&url=${encodeURIComponent(tab.url)}`;
  if (tab.id !== undefined) chrome.tabs.update(tab.id, { url: warningUrl });
};

chrome.runtime.onInstalled.addListener(async () => {
  const state = await chrome.storage.local.get<ExtensionState>([
    "gooberHealth",
    "prohibitedSites",
  ]);
  await chrome.storage.local.set({
    gooberHealth: state.gooberHealth ?? DEFAULT_HEALTH,
    prohibitedSites: state.prohibitedSites ?? DEFAULT_PROHIBITED_SITES,
  });
});

chrome.runtime.onMessage.addListener(async (message: {
  type?: string;
  running?: boolean;
  tabId?: number;
  url?: string;
}) => {
  if (message.type === "PROCEED_TO_SITE") {
    const tabId = message.tabId;
    const url = message.url;
    if (typeof tabId === "number" && typeof url === "string") {
      const site = normalizeSite(url);
      if (site) {
        await applyDamage(site);
        bypassedNavigationByTab.set(tabId, url);
        chrome.tabs.update(tabId, { url });
      }
    }
    return;
  }

  if (message.type === "GO_BACK_FROM_SITE") {
    if (typeof message.tabId === "number") chrome.tabs.remove(message.tabId);
    return;
  }

  if (message.type !== "TIMER_STATE_CHANGED") return;

  chrome.storage.local.set({ timerRunning: message.running });
  if (message.running) {
    chrome.tabs.query({}).then((tabs) => Promise.all(tabs.map(damageForTab)));
  }
});

chrome.tabs.onUpdated.addListener((_tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    damageForTab(tab);
  }
});

chrome.tabs.onActivated.addListener(({ tabId }) => {
  chrome.tabs.get(tabId).then(damageForTab);
});

chrome.action.onClicked.addListener((tab) => {
  console.log('Extension icon clicked', tab);
});

chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));