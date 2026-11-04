import gooberIcon from "./assets/GooberPlaceholder.png";
import {
  DEFAULT_PROHIBITED_SITES,
  getProhibitedSite,
  normalizeSites,
  PROHIBITED_SITES_KEY,
} from "./lib/distractionSites";

chrome.runtime.onInstalled.addListener(() => {
  void initializeSiteMonitoring();
});

const warnedSitesByTab = new Map<number, string>();
let lastActiveTabId: number | null = null;
const notificationId = "studygatchi-off-task-warning";

async function initializeSiteMonitoring() {
  try {
    const stored = await chrome.storage.local.get(PROHIBITED_SITES_KEY);
    if (stored[PROHIBITED_SITES_KEY] === undefined) {
      await chrome.storage.local.set({
        [PROHIBITED_SITES_KEY]: DEFAULT_PROHIBITED_SITES,
      });
    }
    await inspectActiveTab();
  } catch (error) {
    console.error("Could not initialize prohibited-site monitoring:", error);
  }
}

async function inspectTab(tabId: number) {
  const tab = await chrome.tabs.get(tabId);
  if (!tab.active || !tab.url) return;

  lastActiveTabId = tabId;
  const stored = await chrome.storage.local.get(PROHIBITED_SITES_KEY);
  const sites =
    stored[PROHIBITED_SITES_KEY] === undefined
      ? DEFAULT_PROHIBITED_SITES
      : normalizeSites(stored[PROHIBITED_SITES_KEY]);
  const prohibitedSite = getProhibitedSite(tab.url, sites);

  if (!prohibitedSite) {
    warnedSitesByTab.delete(tabId);
    return;
  }

  if (warnedSitesByTab.get(tabId) === prohibitedSite) return;
  warnedSitesByTab.set(tabId, prohibitedSite);

  void chrome.notifications
    .create(notificationId, {
      type: "basic",
      iconUrl: gooberIcon,
      title: "Time to refocus",
      message: `${prohibitedSite} is on your distraction list.`,
    })
    .catch((error: unknown) => {
      warnedSitesByTab.delete(tabId);
      console.error("Could not show the off-task warning:", error);
    });
}

async function inspectActiveTab() {
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  if (tab?.id !== undefined) await inspectTab(tab.id);
}

chrome.tabs.onActivated.addListener(({ tabId }) => {
  if (lastActiveTabId !== null && lastActiveTabId !== tabId) {
    warnedSitesByTab.delete(lastActiveTabId);
  }
  lastActiveTabId = tabId;
  void inspectTab(tabId).catch((error: unknown) => {
    console.error("Could not inspect the active tab:", error);
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && (changeInfo.url || changeInfo.status === "complete")) {
    void inspectTab(tabId).catch((error: unknown) => {
      console.error("Could not inspect the updated tab:", error);
    });
  }
});

chrome.windows.onFocusChanged.addListener(() => {
  void inspectActiveTab().catch((error: unknown) => {
    console.error("Could not inspect the focused window tab:", error);
  });
});

chrome.runtime.onStartup.addListener(() => {
  void inspectActiveTab().catch((error: unknown) => {
    console.error("Could not inspect the startup tab:", error);
  });
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && changes[PROHIBITED_SITES_KEY]) {
    void inspectActiveTab().catch((error: unknown) => {
      console.error("Could not re-check the active tab:", error);
    });
  }
});

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error: unknown) => console.error(error));