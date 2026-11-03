import { useState, useContext, useEffect } from "react";
import "./SettingsMenu.css";
import { ThemeContext } from "./ThemeProvider.tsx";

function normalizeWebsite(value: string): string | null {
  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return null;
  }

  const candidate = /^[a-z][a-z\d+.-]*:\/\//i.test(trimmedValue)
    ? trimmedValue
    : `https://${trimmedValue}`;

  try {
    const url = new URL(candidate);
    const hostname = url.hostname.toLowerCase().replace(/\.$/, "");
    const validHostname =
      hostname.length <= 253 &&
      hostname.split(".").every(
        (label) =>
          label.length > 0 &&
          label.length <= 63 &&
          /^[a-z\d](?:[a-z\d-]*[a-z\d])?$/i.test(label)
      );

    if (
      !["http:", "https:"].includes(url.protocol) ||
      !validHostname ||
      (!hostname.includes(".") && hostname !== "localhost") ||
      url.username ||
      url.password ||
      (url.pathname !== "" && url.pathname !== "/") ||
      url.search ||
      url.hash
    ) {
      return null;
    }

    return hostname;
  } catch {
    return null;
  }
}

export default function SettingsMenu() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("SettingsMenu must be used within a ThemeProvider");
  }
  const { setTheme, themes } = context;

  const [firstOption, setFirst] = useState(false);
  const [secondOption, setSecond] = useState(false);
  const [prohibitedSites, setProhibitedSites] = useState<string[]>([]);
  const [newSite, setNewSite] = useState("");
  const [siteError, setSiteError] = useState("");
  const [storageError, setStorageError] = useState("");
  const [storageReady, setStorageReady] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let active = true;

    const loadProhibitedSites = async () => {
      try {
        const stored = await chrome.storage.local.get("prohibitedSites");
        const sites: unknown = stored.prohibitedSites;

        if (sites === undefined) {
          if (active) {
            setProhibitedSites([]);
            setStorageReady(true);
          }
          return;
        }

        if (
          !Array.isArray(sites) ||
          !sites.every(
            (site): site is string =>
              typeof site === "string" && normalizeWebsite(site) === site
          )
        ) {
          throw new Error("Stored prohibited-site data is invalid.");
        }

        if (active) {
          setProhibitedSites(sites);
          setStorageReady(true);
        }
      } catch (error) {
        if (active) {
          const reason = error instanceof Error ? ` ${error.message}` : "";
          setStorageError(`Could not load prohibited sites.${reason}`);
        }
      }
    };

    void loadProhibitedSites();
    return () => {
      active = false;
    };
  }, []);

  const addProhibitedSite = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const site = normalizeWebsite(newSite);
    if (!site) {
      setSiteError("Enter a valid website, such as example.com.");
      return;
    }

    if (prohibitedSites.includes(site)) {
      setSiteError("That website is already on your prohibited list.");
      return;
    }

    setIsSaving(true);
    setSiteError("");
    try {
      const updatedSites = [...prohibitedSites, site];
      await chrome.storage.local.set({ prohibitedSites: updatedSites });
      setProhibitedSites(updatedSites);
      setNewSite("");
      setStorageError("");
    } catch (error) {
      const reason = error instanceof Error ? ` ${error.message}` : "";
      setStorageError(`Could not save prohibited sites.${reason}`);
    } finally {
      setIsSaving(false);
    }
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
            checked={firstOption}
            onChange={(event) => setFirst(event.target.checked)}
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
            checked={secondOption}
            onChange={(event) => setSecond(event.target.checked)}
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
        <section aria-labelledby="prohibited-sites-heading">
          <h6 id="prohibited-sites-heading">Prohibited Sites</h6>
          <form onSubmit={addProhibitedSite}>
            <label htmlFor="prohibited-site-input" className="form-label">
              Website
            </label>
            <div className="input-group">
              <input
                id="prohibited-site-input"
                className="form-control"
                type="text"
                value={newSite}
                disabled={!storageReady || isSaving}
                onChange={(event) => {
                  setNewSite(event.target.value);
                  setSiteError("");
                }}
                placeholder="example.com"
                aria-describedby={siteError ? "prohibited-site-error" : undefined}
              />
              <button
                className="studygatchi-button"
                type="submit"
                disabled={!storageReady || isSaving}
              >
                Add
              </button>
            </div>
            {siteError && (
              <p id="prohibited-site-error" className="text-danger mt-2 mb-0" role="alert">
                {siteError}
              </p>
            )}
            {storageError && (
              <p className="text-danger mt-2 mb-0" role="alert">
                {storageError}
              </p>
            )}
          </form>
          {!storageReady && !storageError ? (
            <p className="mt-3 mb-0">Loading prohibited sites...</p>
          ) : storageReady && prohibitedSites.length > 0 ? (
            <ul className="list-group mt-3" aria-label="Prohibited sites">
              {prohibitedSites.map((site) => (
                <li className="list-group-item" key={site}>
                  {site}
                </li>
              ))}
            </ul>
          ) : storageReady ? (
            <p className="mt-3 mb-0">No prohibited sites added yet.</p>
          ) : null}
        </section>
      </div>
    </div>
  );
}
