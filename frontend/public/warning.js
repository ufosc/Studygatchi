const params = new URLSearchParams(window.location.search);
const site = params.get("site") || "this site";
const url = params.get("url");

document.getElementById("site").textContent = site;

document.getElementById("proceed").addEventListener("click", () => {
  chrome.tabs.getCurrent((tab) => {
    if (tab.id !== undefined && url) {
      chrome.runtime.sendMessage({ type: "PROCEED_TO_SITE", tabId: tab.id, url });
    }
  });
});

document.getElementById("back").addEventListener("click", () => {
  chrome.tabs.getCurrent((tab) => {
    if (tab.id !== undefined) {
      chrome.runtime.sendMessage({ type: "GO_BACK_FROM_SITE", tabId: tab.id });
    }
  });
});
