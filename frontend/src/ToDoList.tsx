import { useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Outfit:wght@300;400;500&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  /* ── Overlay backdrop ── */
  .todo-overlay {
    position: fixed;
    inset: 0;
    background: rgba(8, 6, 18, 0.72);
    backdrop-filter: blur(14px) saturate(0.6);
    -webkit-backdrop-filter: blur(14px) saturate(0.6);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  /* ── Card ── */
  .todo-card {
    width: min(460px, 92vw);
    background: #0f0d1a;
    border-radius: 28px;
    border: 1px solid rgba(255,255,255,0.07);
    box-shadow:
      0 0 0 1px rgba(120,80,255,0.15),
      0 32px 80px rgba(0,0,0,0.7),
      inset 0 1px 0 rgba(255,255,255,0.06);
    padding: 36px 32px 40px;
    position: relative;
    overflow: hidden;
    animation: slideUp 0.35s cubic-bezier(0.22,1,0.36,1);
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(24px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .todo-card::before {
    content: '';
    position: absolute;
    top: -80px;
    right: -60px;
    width: 260px;
    height: 260px;
    background: radial-gradient(circle, rgba(120,80,255,0.22) 0%, transparent 70%);
    pointer-events: none;
  }

  .todo-card::after {
    content: '';
    position: absolute;
    bottom: -60px;
    left: -40px;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(255,100,160,0.14) 0%, transparent 70%);
    pointer-events: none;
  }

  /* ── Header ── */
  .todo-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 28px;
    position: relative;
    z-index: 1;
  }

  .todo-header-text h1 {
    font-family: 'Syne', sans-serif;
    font-size: 2rem;
    font-weight: 800;
    color: #fff;
    letter-spacing: -0.03em;
    line-height: 1;
  }

  .todo-header-text h1 span {
    background: linear-gradient(135deg, #a78bfa, #f472b6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .todo-badge {
    font-family: 'Outfit', sans-serif;
    font-size: 0.7rem;
    font-weight: 500;
    color: rgba(255,255,255,0.35);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    margin-top: 6px;
  }

  .todo-progress-ring {
    flex-shrink: 0;
    position: relative;
    width: 48px;
    height: 48px;
  }

  .todo-progress-ring svg {
    transform: rotate(-90deg);
  }

  .ring-bg {
    fill: none;
    stroke: rgba(255,255,255,0.07);
    stroke-width: 3;
  }

  .ring-fill {
    fill: none;
    stroke: url(#ringGrad);
    stroke-width: 3;
    stroke-linecap: round;
    transition: stroke-dashoffset 0.5s cubic-bezier(0.4,0,0.2,1);
  }

  .ring-label {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Outfit', sans-serif;
    font-size: 0.65rem;
    font-weight: 500;
    color: rgba(255,255,255,0.5);
  }

  /* ── Form ── */
  .todo-form {
    display: flex;
    gap: 8px;
    margin-bottom: 24px;
    position: relative;
    z-index: 1;
  }

  .todo-input {
    flex: 1;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 14px;
    padding: 13px 16px;
    font-family: 'Outfit', sans-serif;
    font-size: 0.88rem;
    color: #fff;
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  }

  .todo-input::placeholder {
    color: rgba(255,255,255,0.2);
  }

  .todo-input:focus {
    border-color: rgba(167,139,250,0.5);
    background: rgba(255,255,255,0.07);
    box-shadow: 0 0 0 3px rgba(167,139,250,0.1);
  }

  .todo-add-btn {
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    color: #fff;
    border: none;
    border-radius: 14px;
    padding: 13px 20px;
    font-family: 'Outfit', sans-serif;
    font-size: 0.88rem;
    font-weight: 500;
    cursor: pointer;
    letter-spacing: 0.02em;
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 4px 14px rgba(124,58,237,0.4);
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .todo-add-btn:hover {
    opacity: 0.88;
    box-shadow: 0 6px 20px rgba(124,58,237,0.5);
  }

  .todo-add-btn:active {
    transform: scale(0.96);
  }

  /* ── Divider ── */
  .todo-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
    margin-bottom: 18px;
    position: relative;
    z-index: 1;
  }

  /* ── List ── */
  .todo-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 7px;
    position: relative;
    z-index: 1;
  }

  .todo-item {
    display: flex;
    align-items: center;
    gap: 12px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px;
    padding: 13px 14px;
    transition: background 0.2s, border-color 0.2s, transform 0.15s;
    animation: itemIn 0.28s cubic-bezier(0.22,1,0.36,1) both;
    position: relative;
  }

  @keyframes itemIn {
    from { opacity: 0; transform: translateX(-10px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .todo-item:hover {
    background: rgba(255,255,255,0.07);
    border-color: rgba(167,139,250,0.2);
    transform: translateX(2px);
  }

  .todo-item.checked {
    opacity: 0.4;
  }

  /* Delete hidden by default, revealed on hover */
  .todo-del-btn {
    opacity: 0;
    pointer-events: none;
    background: rgba(239,68,68,0.12);
    border: 1px solid rgba(239,68,68,0.2);
    color: #f87171;
    cursor: pointer;
    padding: 5px 10px;
    border-radius: 9px;
    display: flex;
    align-items: center;
    gap: 5px;
    font-family: 'Outfit', sans-serif;
    font-size: 0.72rem;
    font-weight: 500;
    flex-shrink: 0;
    transition: opacity 0.18s, background 0.18s, transform 0.15s;
  }

  .todo-del-btn svg {
    width: 13px;
    height: 13px;
    flex-shrink: 0;
  }

  .todo-item:hover .todo-del-btn {
    opacity: 1;
    pointer-events: auto;
  }

  .todo-del-btn:hover {
    background: rgba(239,68,68,0.22);
    transform: scale(1.05);
  }

  .todo-del-btn:active {
    transform: scale(0.95);
  }

  /* ── Checkbox ── */
  .todo-checkbox-wrapper {
    position: relative;
    flex-shrink: 0;
    width: 22px;
    height: 22px;
  }

  .todo-checkbox-wrapper input[type="checkbox"] {
    opacity: 0;
    position: absolute;
    inset: 0;
    cursor: pointer;
    z-index: 2;
    width: 100%;
    height: 100%;
  }

  .custom-checkbox {
    position: absolute;
    inset: 0;
    border: 2px solid rgba(255,255,255,0.18);
    border-radius: 7px;
    background: rgba(255,255,255,0.04);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s, border-color 0.2s;
    cursor: pointer;
  }

  .todo-checkbox-wrapper input[type="checkbox"]:checked + .custom-checkbox {
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    border-color: transparent;
  }

  .checkmark {
    opacity: 0;
    color: white;
    font-size: 12px;
    font-weight: 700;
    transition: opacity 0.15s, transform 0.15s;
    transform: scale(0.5);
    line-height: 1;
  }

  .todo-checkbox-wrapper input[type="checkbox"]:checked + .custom-checkbox .checkmark {
    opacity: 1;
    transform: scale(1);
  }

  /* ── Label ── */
  .todo-label {
    flex: 1;
    font-family: 'Outfit', sans-serif;
    font-size: 0.9rem;
    color: rgba(255,255,255,0.85);
    font-weight: 400;
    cursor: pointer;
    user-select: none;
    transition: color 0.2s;
    letter-spacing: 0.01em;
  }

  .todo-item.checked .todo-label {
    text-decoration: line-through;
    color: rgba(255,255,255,0.3);
  }

  /* ── Empty state ── */
  .todo-empty {
    text-align: center;
    padding: 32px 0;
    color: rgba(255,255,255,0.18);
    font-family: 'Outfit', sans-serif;
    font-size: 0.85rem;
    font-style: italic;
  }

  /* ── Footer ── */
  .todo-footer {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    position: relative;
    z-index: 1;
  }

  .todo-footer-pill {
    font-family: 'Outfit', sans-serif;
    font-size: 0.72rem;
    font-weight: 500;
    color: rgba(255,255,255,0.3);
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 999px;
    padding: 4px 12px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  /* ── Trigger button ── */
  .todo-trigger {
    position: fixed;
    bottom: 32px;
    right: 32px;
    z-index: 50;
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    color: #fff;
    border: none;
    border-radius: 999px;
    padding: 14px 24px;
    font-family: 'Outfit', sans-serif;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    box-shadow: 0 8px 24px rgba(124,58,237,0.5);
    display: flex;
    align-items: center;
    gap: 8px;
    transition: transform 0.2s, box-shadow 0.2s;
    letter-spacing: 0.02em;
  }

  .todo-trigger:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(124,58,237,0.6);
  }

  .todo-trigger:active {
    transform: scale(0.96);
  }

  /* ── Close button ── */
  .todo-close-btn {
    position: absolute;
    top: 14px;
    right: 14px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.4);
    border-radius: 8px;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 14px;
    transition: background 0.2s, color 0.2s;
    z-index: 2;
  }

  .todo-close-btn:hover {
    background: rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.8);
  }
`;

const TrashIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="2,4 14,4" />
    <path d="M5 4V2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5V4" />
    <path d="M6.5 7v4.5M9.5 7v4.5" />
    <path d="M3 4l.9 9.1A1 1 0 0 0 4.9 14h6.2a1 1 0 0 0 1-.9L13 4" />
  </svg>
);

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <path d="M7 2v10M2 7h10" />
  </svg>
);

const RADIUS = 20;
const CIRC = 2 * Math.PI * RADIUS;

export default function ToDoList() {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState([
    "Lock in time",
    "Read Chapters 2-3",
    "Write new Draft",
  ]);
  const [newItem, setNewItem] = useState("");
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(
    () =>
      items.reduce((acc, item) => {
        acc[item] = false;
        return acc;
      }, {} as Record<string, boolean>)
  );

  const addItem = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newItem.trim()) return;
    setItems((prev) => [...prev, newItem]);
    setCheckedItems((prev) => ({ ...prev, [newItem]: false }));
    setNewItem("");
  };

  const checkItem = (item: string) => {
    setCheckedItems((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  const removeItem = (item: string) => {
    setItems((prev) => prev.filter((i) => i !== item));
    setCheckedItems((prev) => {
      const copy = { ...prev };
      delete copy[item];
      return copy;
    });
  };

  const completed = items.filter((i) => checkedItems[i]).length;
  const progress = items.length === 0 ? 0 : completed / items.length;
  const dashOffset = CIRC * (1 - progress);

  return (
    <>
      <style>{styles}</style>

      {/* Floating trigger */}
      <button className="todo-trigger" onClick={() => setIsOpen(true)}>
        <PlusIcon />
        My Tasks
      </button>

      {/* Full-screen overlay — hides page content behind blur */}
      {isOpen && (
        <div
          className="todo-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}
        >
          <div className="todo-card">
            <button className="todo-close-btn" onClick={() => setIsOpen(false)} aria-label="Close">✕</button>

            <div className="todo-header">
              <div className="todo-header-text">
                <h1>Goober <span>Tasks</span></h1>
                <p className="todo-badge">{completed} of {items.length} complete</p>
              </div>

              <div className="todo-progress-ring">
                <svg width="48" height="48" viewBox="0 0 48 48">
                  <defs>
                    <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a78bfa" />
                      <stop offset="100%" stopColor="#f472b6" />
                    </linearGradient>
                  </defs>
                  <circle className="ring-bg" cx="24" cy="24" r={RADIUS} />
                  <circle
                    className="ring-fill"
                    cx="24"
                    cy="24"
                    r={RADIUS}
                    strokeDasharray={CIRC}
                    strokeDashoffset={dashOffset}
                  />
                </svg>
                <div className="ring-label">{items.length === 0 ? "—" : `${Math.round(progress * 100)}%`}</div>
              </div>
            </div>

            <form className="todo-form" onSubmit={addItem}>
              <input
                className="todo-input"
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="Add a new task..."
                autoFocus
              />
              <button className="todo-add-btn" type="submit">
                <PlusIcon />
                Add
              </button>
            </form>

            <div className="todo-divider" />

            <ul className="todo-list">
              {items.length === 0 && (
                <p className="todo-empty">All clear — enjoy your day ✦</p>
              )}
              {items.map((item) => (
                <li
                  key={item}
                  className={`todo-item ${checkedItems[item] ? "checked" : ""}`}
                >
                  <div className="todo-checkbox-wrapper">
                    <input
                      type="checkbox"
                      id={`cb-${item}`}
                      checked={checkedItems[item]}
                      onChange={() => checkItem(item)}
                    />
                    <div className="custom-checkbox">
                      <span className="checkmark">✓</span>
                    </div>
                  </div>
                  <label className="todo-label" htmlFor={`cb-${item}`}>
                    {item}
                  </label>
                  <button
                    className="todo-del-btn"
                    onClick={() => removeItem(item)}
                    aria-label="Delete"
                  >
                    <TrashIcon />
                    Delete
                  </button>
                </li>
              ))}
            </ul>

            {items.length > 0 && (
              <div className="todo-footer">
                <span className="todo-footer-pill">
                  {items.length - completed} remaining
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}