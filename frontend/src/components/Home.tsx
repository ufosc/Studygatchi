import { FormEvent, useEffect, useState } from "react";
import oscLogo from "../assets/osc-logo.png";
import githubLogo from "../assets/github-mark-white.svg";
import {
  DEFAULT_PROHIBITED_SITES,
  normalizeSite,
  normalizeSites,
  PROHIBITED_SITES_KEY,
} from "../lib/distractionSites";
import "./Home.css";

const extensionMonitoringAvailable =
  typeof chrome !== "undefined" && Boolean(chrome.storage?.local);

const Home = () => {
  const [sites, setSites] = useState<string[]>(DEFAULT_PROHIBITED_SITES);
  const [siteInput, setSiteInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!extensionMonitoringAvailable) return;

    let cancelled = false;
    const loadSites = async () => {
      try {
        const stored = await chrome.storage.local.get(PROHIBITED_SITES_KEY);
        const initialSites =
          stored[PROHIBITED_SITES_KEY] === undefined
            ? DEFAULT_PROHIBITED_SITES
            : normalizeSites(stored[PROHIBITED_SITES_KEY]);

        if (stored[PROHIBITED_SITES_KEY] === undefined) {
          await chrome.storage.local.set({
            [PROHIBITED_SITES_KEY]: initialSites,
          });
        }
        if (!cancelled) setSites(initialSites);
      } catch (loadError) {
        console.error("Could not load prohibited websites:", loadError);
        if (!cancelled) setError("Could not load your website list.");
      }
    };

    void loadSites();
    return () => {
      cancelled = true;
    };
  }, []);

  const saveSites = async (nextSites: string[]) => {
    if (!extensionMonitoringAvailable) return;

    try {
      await chrome.storage.local.set({
        [PROHIBITED_SITES_KEY]: nextSites,
      });
      setSites(nextSites);
      setError("");
    } catch (saveError) {
      console.error("Could not save prohibited websites:", saveError);
      setError("Could not save your website list. Please try again.");
    }
  };

  const addSite = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedSite = normalizeSite(siteInput);

    if (!normalizedSite) {
      setError("Enter a valid website domain, such as example.com.");
      return;
    }
    if (sites.includes(normalizedSite)) {
      setError(`${normalizedSite} is already on your list.`);
      return;
    }

    void saveSites([...sites, normalizedSite].sort());
    setSiteInput("");
  };

  const removeSite = (site: string) => {
    void saveSites(sites.filter((listedSite) => listedSite !== site));
  };

  return (
    <main className="home-page">
      <div className="home-links">
        <a href="https://ufosc.org/projects/" target="_blank" rel="noreferrer">
          <img src={oscLogo} className="logo" alt="OSC logo" />
        </a>
        <a
          href="https://github.com/ufosc/Studygatchi"
          target="_blank"
          rel="noreferrer"
        >
          <img src={githubLogo} className="logo github" alt="GitHub logo" />
        </a>
      </div>
      <h1>Welcome to StudyGatchi!</h1>

      <section className="card focus-card" aria-labelledby="focus-title">
        <h2 id="focus-title">Stay on task</h2>
        <p>
          StudyGatchi will warn you when you visit a website on this list.
          Common distracting sites also show an in-page warning.
        </p>

        {!extensionMonitoringAvailable && (
          <p className="monitoring-note" role="status">
            Website monitoring is available when StudyGatchi is installed as a
            Chrome extension.
          </p>
        )}

        <form className="site-form" onSubmit={addSite}>
          <label htmlFor="prohibited-site">Add a website</label>
          <div className="site-form-controls">
            <input
              id="prohibited-site"
              type="text"
              value={siteInput}
              placeholder="example.com"
              onChange={(event) => setSiteInput(event.target.value)}
              disabled={!extensionMonitoringAvailable}
            />
            <button type="submit" disabled={!extensionMonitoringAvailable}>
              Add
            </button>
          </div>
        </form>

        {error && (
          <p className="site-error" role="alert">
            {error}
          </p>
        )}

        <ul className="prohibited-site-list" aria-label="Prohibited websites">
          {sites.map((site) => (
            <li key={site}>
              <span>{site}</span>
              <button
                type="button"
                aria-label={`Remove ${site}`}
                onClick={() => removeSite(site)}
                disabled={!extensionMonitoringAvailable}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </section>

      <p className="read-the-docs">
        Click the OSC link to explore the Open Source Club.
      </p>
    </main>
  );
};

export default Home;
