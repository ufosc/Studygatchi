import { useState, useEffect, useContext, type FormEvent } from "react";
import "./SettingsMenu.css";
import { ThemeContext } from "./ThemeProvider.tsx";
import {
  addProhibitedSite,
  getProhibitedSites,
  type ProhibitedSite,
} from "../lib/prohibitedSites";

export default function SettingsMenu() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("SettingsMenu must be used within a ThemeProvider");
  }
  const { setTheme, themes } = context;

  const [firstOption, setFirst] = useState(false);
  const [secondOption, setSecond] = useState(false);
  const [sites, setSites] = useState<ProhibitedSite[]>([]);
  const [newSite, setNewSite] = useState("");
  const [isLoadingSites, setIsLoadingSites] = useState(true);
  const [isAddingSite, setIsAddingSite] = useState(false);
  const [siteError, setSiteError] = useState<string | null>(null);
  const [siteMessage, setSiteMessage] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    getProhibitedSites(controller.signal)
      .then((loadedSites) => {
        if (!controller.signal.aborted) setSites(loadedSites);
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setSiteError(error instanceof Error ? error.message : "Unable to load prohibited sites.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoadingSites(false);
      });

    return () => controller.abort();
  }, []);

  const addSite = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedSite = newSite.trim();
    if (!trimmedSite) {
      setSiteError("Enter a website to add.");
      setSiteMessage(null);
      return;
    }

    try {
      const parsed = new URL(
        /^[a-z][a-z\d+.-]*:\/\//i.test(trimmedSite) ? trimmedSite : `https://${trimmedSite}`,
      );
      if (
        !["http:", "https:"].includes(parsed.protocol) ||
        !parsed.hostname ||
        parsed.username ||
        parsed.password
      ) {
        setSiteError("Enter a valid HTTP or HTTPS website URL.");
        setSiteMessage(null);
        return;
      }
    } catch {
      setSiteError("Enter a valid HTTP or HTTPS website URL.");
      setSiteMessage(null);
      return;
    }

    setIsAddingSite(true);
    setSiteError(null);
    setSiteMessage(null);
    try {
      const addedSite = await addProhibitedSite(trimmedSite);
      setSites((currentSites) => [...currentSites, addedSite]);
      setNewSite("");
      setSiteMessage("Website added.");
    } catch (error: unknown) {
      setSiteError(error instanceof Error ? error.message : "Unable to add this website.");
    } finally {
      setIsAddingSite(false);
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
        <section aria-labelledby="prohibited-sites-heading" className="prohibitedSites">
          <h6 id="prohibited-sites-heading">Prohibited Websites</h6>
          <form onSubmit={addSite} className="prohibitedSites-form">
            <label className="visually-hidden" htmlFor="prohibited-site-url">
              Website URL
            </label>
            <input
              id="prohibited-site-url"
              type="text"
              value={newSite}
              disabled={isAddingSite}
              onChange={(event) => {
                setNewSite(event.target.value);
                setSiteError(null);
                setSiteMessage(null);
              }}
              placeholder="example.com"
              autoComplete="url"
              aria-describedby={siteError ? "prohibited-site-error" : undefined}
            />
            <button type="submit" disabled={isAddingSite}>
              {isAddingSite ? "Adding..." : "Add"}
            </button>
          </form>
          {siteError && (
            <p id="prohibited-site-error" className="prohibitedSites-error" role="alert">
              {siteError}
            </p>
          )}
          {siteMessage && (
            <p className="prohibitedSites-success" role="status">
              {siteMessage}
            </p>
          )}
          {isLoadingSites ? (
            <p role="status">Loading prohibited websites...</p>
          ) : sites.length === 0 ? (
            <p>No prohibited websites added.</p>
          ) : (
            <ul className="prohibitedSites-list">
              {sites.map((site) => (
                <li key={site.id}>{site.url}</li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
