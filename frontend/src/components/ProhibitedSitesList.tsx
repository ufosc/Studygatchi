import { useEffect, useState } from "react";
import type { ProhibitedSite } from "../types/prohibitedSites";
import { getProhibitedSites, removeProhibitedSite } from "../api/prohibitedSites";
import "./ProhibitedSites.css";

type Props = {
  lockedIn?: boolean;
};

export default function ProhibitedSitesList({ lockedIn = false }: Props) {
  const [sites, setSites] = useState<ProhibitedSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    getProhibitedSites()
      .then((data) => {
        if (!cancelled) setSites(data);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load your prohibited sites.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleRemove = async (site: ProhibitedSite) => {
    if (lockedIn) return;
    if (!window.confirm(`Remove ${site.url} from your prohibited sites?`)) return;

    setError(null);
    setRemovingId(site.id);
    try {
      await removeProhibitedSite(site.id);
      setSites((prev) => prev.filter((s) => s.id !== site.id));
    } catch {
      setError(`Couldn't remove ${site.url}. Please try again.`);
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="prohibited-sites">
      {lockedIn && (
        <p className="prohibited-sites-note">
          You're locked in! Sites can be removed after your focus session.
        </p>
      )}
      {error && (
        <p className="prohibited-sites-error" role="alert">
          {error}
        </p>
      )}
      {loading ? (
        <p className="prohibited-sites-note">Loading…</p>
      ) : sites.length === 0 ? (
        <p className="prohibited-sites-note">No prohibited sites yet.</p>
      ) : (
        <ul className="prohibited-sites-list">
          {sites.map((site) => (
            <li key={site.id} className="prohibited-sites-item">
              <span className="prohibited-sites-url">{site.url}</span>
              <button
                type="button"
                className="prohibited-sites-remove"
                aria-label={`Remove ${site.url}`}
                title={lockedIn ? "Can't remove sites while locked in" : `Remove ${site.url}`}
                disabled={lockedIn || removingId === site.id}
                onClick={() => handleRemove(site)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}