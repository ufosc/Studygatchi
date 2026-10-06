import { FormEvent, useContext, useEffect, useState } from "react";
import "./SettingsMenu.css";
import { ThemeContext } from "./ThemeProvider.tsx";

const DEFAULT_PROHIBITED_SITES = [
  "youtube.com",
  "instagram.com",
  "x.com",
  "facebook.com",
];

export default function SettingsMenu() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("SettingsMenu must be used within a ThemeProvider");
  }
  const { setTheme, themes } = context;

  const [firstOption, setFirst] = useState(false);
  const [secondOption, setSecond] = useState(false);
  const [prohibitedSites, setProhibitedSites] = useState<string[]>([]);
  const [siteInput, setSiteInput] = useState("");
  const [siteError, setSiteError] = useState("");
  const [lockedIn, setLockedIn] = useState(false);

  const hasExtensionStorage =
    typeof chrome !== "undefined" && Boolean(chrome.storage?.local);

  const normalizeSite = (site: string): string | null => {
    try {
      const url = new URL(site.includes("://") ? site : `https://${site}`);
      return url.hostname.toLowerCase().replace(/^www\./, "");
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const loadSettings = async () => {
      if (hasExtensionStorage) {
        const state = await chrome.storage.local.get<{
          prohibitedSites?: string[];
          timerRunning?: boolean;
        }>(["prohibitedSites", "timerRunning"]);
        setProhibitedSites(state.prohibitedSites ?? []);
        setLockedIn(state.timerRunning ?? false);
        return;
      }

      const storedSites = localStorage.getItem("prohibitedSites");
      const sites = storedSites ? JSON.parse(storedSites) : DEFAULT_PROHIBITED_SITES;
      setProhibitedSites(sites);
      if (!storedSites) {
        localStorage.setItem("prohibitedSites", JSON.stringify(sites));
      }
    };

    loadSettings();

    if (!hasExtensionStorage) return;

    const handleStorageChange = (
      changes: { timerRunning?: chrome.storage.StorageChange },
      areaName: string,
    ) => {
      if (areaName === "local" && changes.timerRunning) {
        setLockedIn(Boolean(changes.timerRunning.newValue));
      }
    };
    chrome.storage.onChanged.addListener(handleStorageChange);
    return () => chrome.storage.onChanged.removeListener(handleStorageChange);
  }, [hasExtensionStorage]);

  const saveSites = async (sites: string[]) => {
    setProhibitedSites(sites);
    if (hasExtensionStorage) {
      await chrome.storage.local.set({ prohibitedSites: sites });
    } else {
      localStorage.setItem("prohibitedSites", JSON.stringify(sites));
    }
  };

  const addSite = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedSite = normalizeSite(siteInput.trim());

    if (!normalizedSite) {
      setSiteError("Enter a valid domain or URL.");
      return;
    }
    if (prohibitedSites.includes(normalizedSite)) {
      setSiteError("That site is already prohibited.");
      return;
    }

    await saveSites([...prohibitedSites, normalizedSite]);
    setSiteInput("");
    setSiteError("");
  };

  const removeSite = async (site: string) => {
    if (lockedIn) return;
    await saveSites(prohibitedSites.filter((currentSite) => currentSite !== site));
  };

  return (
    <div className="card bCard" style={{ width: "400px" }}>
      <div
        className="card-header"
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <button type="button" className="studygatchi-button" aria-label="Close"></button>
        <text
          style={{
            fontSize: 12,
            marginTop: "auto",
            marginLeft: "auto",
          }}
        >
          <text>Money</text>
        </text>
      </div>
      <div className="card-body">
        <h5 className="card-title">General</h5>
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id="sampleCheckbox1"
            onClick={() => {
              firstOption ? setFirst(false) : setFirst(true);
            }}
          />
          <label className="form-check-label" htmlFor="sampleCheckbox1">
            This is set to {firstOption ? "true" : "false"}
          </label>
        </div>
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id="sampleCheckbox2"
            onClick={() => {
              secondOption ? setSecond(false) : setSecond(true);
            }}
          />
          <label className="form-check-label" htmlFor="sampleCheckbox2">
            This is set to {secondOption ? "true" : "false"}
          </label>
        </div>
        <label htmlFor="range1" className="form-label">
          Example range
        </label>
        <input type="range" className="form-range" id="range1"></input>
        <h5 className="card-title" style={{ paddingTop: 10 }}>
          Themes
        </h5>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="themeChoice" type="button" style={{ backgroundColor: themes.pink.bg }}
            onClick={() => setTheme(themes.pink)}
          ></button>
          <button className="themeChoice" type="button" style={{ backgroundColor: themes.green.bg }}
            onClick={() => setTheme(themes.green)}
          ></button>
          <button className="themeChoice" type="button" style={{ backgroundColor: themes.lightblue.bg }}
            onClick={() => setTheme(themes.lightblue)}
          ></button>
          <button className="themeChoice" type="button" style={{ backgroundColor: themes.white.bg }}
            onClick={() => setTheme(themes.white)}
          ></button>
          <button className="themeChoice" type="button" style={{ backgroundColor: themes.black.bg }}
            onClick={() => setTheme(themes.black)}
          ></button>
        </div>
        <h5 className="card-title" style={{ paddingTop: 10 }}>
          Miscellaneous
        </h5>
        <section className="prohibited-sites" aria-labelledby="prohibited-sites-title">
          <h6 id="prohibited-sites-title">Prohibited sites</h6>
          <p className="settings-note">
            {lockedIn
              ? "Unlock the timer to change this list."
              : "Sites on this list damage your Goober during the timer."}
          </p>
          <form className="prohibited-site-form" onSubmit={addSite}>
            <label htmlFor="prohibited-site">Domain or URL</label>
            <div className="prohibited-site-input-row">
              <input
                id="prohibited-site"
                type="text"
                value={siteInput}
                placeholder="example.com"
                disabled={lockedIn}
                onChange={(event) => setSiteInput(event.target.value)}
              />
              <button type="submit" disabled={lockedIn || !siteInput.trim()}>
                Add
              </button>
            </div>
          </form>
          {siteError && <div className="site-error" role="alert">{siteError}</div>}
          {prohibitedSites.length === 0 ? (
            <p className="settings-note">No prohibited sites yet.</p>
          ) : (
            <ul className="prohibited-site-list">
              {prohibitedSites.map((site) => (
                <li key={site}>
                  <span>{site}</span>
                  <button
                    type="button"
                    disabled={lockedIn}
                    onClick={() => removeSite(site)}
                    aria-label={`Remove ${site}`}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
