import { useState } from "react";

// cost in StudyUser.money per spin (must match backend SPIN_COST)
const SPIN_COST = 10;
// relative URL for api requests
const API_BASE = "/api";

interface Props {
  // switch goobermenu page back to "home"
  pageSetter: (page: string) => void;
  // current money from App state
  money: number;
  // update App money after successful spin response
  setMoney: (money: number) => void;
}
interface WonItem {
  id: number;
  name: string;
  rarity: string;
  asset_key: string;
}
/**
 * Calls POST /api/spin/ to spend money and win a cosmetic.
 * Requires backend running; without auth the request may fail with 401/403.
 */
export default function GooberGiftMenu({
  pageSetter,
  money,
  setMoney,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wonItem, setWonItem] = useState<WonItem | null>(null);

  const handleSpin = async () => {
    setError(null);
    setWonItem(null);
    if (money < SPIN_COST) {
      setError("Not enough money");
      return;
    }
    setLoading(true);
    try {
      // for local testing ONLY: set VITE_API_USERNAME / VITE_API_PASSWORD in frontend/.env.local
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      const username = import.meta.env.VITE_API_USERNAME;
      const password = import.meta.env.VITE_API_PASSWORD;
      if (username && password) {
        headers.Authorization = `Basic ${btoa(`${username}:${password}`)}`;
      }

      const response = await fetch(`${API_BASE}/spin/`, {
        method: "POST",
        credentials: "include",
        headers,
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(
          data.error ?? data.detail ?? `Spin failed (${response.status})`,
        );
        return;
      }
      // trust server values for the won item and remaining money
      setWonItem(data.item);
      setMoney(data.money);
    } catch {
      // fetch never got a response
      setError("Could not reach server");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div style={{ backgroundColor: "var(--bg-color)", padding: "15px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "12px",
        }}
      >
        <span>Gacha</span>
        <span>${money}</span>
      </div>
      <p style={{ fontSize: 14 }}>Spin for cosmetics — ${SPIN_COST}</p>
      <button
        type="button"
        className="studygatchi-button"
        onClick={handleSpin}
        disabled={loading || money < SPIN_COST}
      >
        {loading ? "Spinning..." : "Spin"}
      </button>
      {error && <p style={{ color: "salmon", marginTop: 12 }}>{error}</p>}
      {wonItem && (
        <div style={{ marginTop: 12 }}>
          <p>You won:</p>
          <p>
            <strong>{wonItem.name}</strong> ({wonItem.rarity})
          </p>
        </div>
      )}
      <button
        type="button"
        className="studygatchi-button"
        style={{ marginTop: 12 }}
        onClick={() => pageSetter("home")}
      >
        home
      </button>
    </div>
  );
}
