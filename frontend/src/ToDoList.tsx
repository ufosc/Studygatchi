import { useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    background: #f5f0e8;
  }

  .todo-root {
    min-height: 100vh;
    background: #f5f0e8;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 60px 20px;
    font-family: 'DM Sans', sans-serif;
  }

  .todo-card {
    width: 100%;
    max-width: 440px;
    background: #fffef9;
    border-radius: 24px;
    box-shadow:
      0 2px 0 #d9c9a8,
      0 4px 0 #cbb896,
      0 8px 32px rgba(0,0,0,0.08);
    padding: 36px 32px 40px;
    position: relative;
  }

  .todo-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 48px;
    right: 48px;
    height: 3px;
    background: linear-gradient(90deg, #f28b50, #e8b86d, #82c9a5);
    border-radius: 0 0 4px 4px;
  }

  .todo-header {
    margin-bottom: 28px;
  }

  .todo-header h1 {
    font-family: 'Caveat', cursive;
    font-size: 2.6rem;
    font-weight: 700;
    color: #2d2416;
    line-height: 1;
    letter-spacing: -0.5px;
  }

  .todo-header .subtitle {
    font-size: 0.8rem;
    font-weight: 300;
    color: #a08c6e;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-top: 4px;
  }

  .todo-form {
    display: flex;
    gap: 8px;
    margin-bottom: 28px;
  }

  .todo-input {
    flex: 1;
    border: 2px solid #e8dcc8;
    background: #faf7f0;
    border-radius: 12px;
    padding: 12px 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    color: #2d2416;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .todo-input::placeholder {
    color: #c4b49a;
  }

  .todo-input:focus {
    border-color: #f28b50;
    box-shadow: 0 0 0 3px rgba(242,139,80,0.12);
  }

  .todo-add-btn {
    background: #2d2416;
    color: #f5f0e8;
    border: none;
    border-radius: 12px;
    padding: 12px 20px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    letter-spacing: 0.04em;
    transition: background 0.2s, transform 0.1s;
    white-space: nowrap;
  }

  .todo-add-btn:hover {
    background: #f28b50;
  }

  .todo-add-btn:active {
    transform: scale(0.97);
  }

  .todo-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, #e8dcc8, transparent);
    margin-bottom: 20px;
  }

  .todo-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .todo-item {
    display: flex;
    align-items: center;
    gap: 12px;
    background: #faf7f0;
    border: 2px solid #efe6d4;
    border-radius: 14px;
    padding: 14px 16px;
    transition: border-color 0.2s, opacity 0.2s, transform 0.15s;
    animation: slideIn 0.25s ease-out;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .todo-item:hover {
    border-color: #d9c9a8;
  }

  .todo-item.checked {
    opacity: 0.55;
  }

  .todo-checkbox-wrapper {
    position: relative;
    flex-shrink: 0;
  }

  .todo-checkbox-wrapper input[type="checkbox"] {
    opacity: 0;
    position: absolute;
    width: 22px;
    height: 22px;
    cursor: pointer;
    z-index: 1;
  }

  .custom-checkbox {
    width: 22px;
    height: 22px;
    border: 2px solid #d4c4a8;
    border-radius: 6px;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s, border-color 0.2s;
    cursor: pointer;
  }

  .todo-checkbox-wrapper input[type="checkbox"]:checked + .custom-checkbox {
    background: #82c9a5;
    border-color: #82c9a5;
  }

  .checkmark {
    opacity: 0;
    color: white;
    font-size: 13px;
    font-weight: 700;
    transition: opacity 0.15s;
    line-height: 1;
  }

  .todo-checkbox-wrapper input[type="checkbox"]:checked + .custom-checkbox .checkmark {
    opacity: 1;
  }

  .todo-label {
    flex: 1;
    font-size: 0.92rem;
    color: #3d2e18;
    font-weight: 400;
    cursor: pointer;
    transition: text-decoration 0.2s;
    user-select: none;
  }

  .todo-item.checked .todo-label {
    text-decoration: line-through;
    color: #a08c6e;
  }

  .todo-del-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: #d4c4a8;
    padding: 4px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s, background 0.2s;
    font-size: 16px;
    line-height: 1;
    flex-shrink: 0;
  }

  .todo-del-btn:hover {
    color: #e05c5c;
    background: rgba(224,92,92,0.08);
  }

  .todo-empty {
    text-align: center;
    padding: 28px 0;
    color: #c4b49a;
    font-size: 0.85rem;
    font-style: italic;
  }

  .todo-footer {
    margin-top: 20px;
    text-align: right;
    font-size: 0.75rem;
    color: #c4b49a;
    font-weight: 300;
  }
`;

export default function ToDoList() {
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

  return (
    <>
      <style>{styles}</style>
      <div className="todo-root">
        <div className="todo-card">
          <div className="todo-header">
            <h1>Goober To Do</h1>
            <p className="subtitle">
              {completed} of {items.length} done
            </p>
          </div>

          <form className="todo-form" onSubmit={addItem}>
            <input
              className="todo-input"
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Add something new..."
            />
            <button className="todo-add-btn" type="submit">
              + Add
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
                  ✕
                </button>
              </li>
            ))}
          </ul>

          {items.length > 0 && (
            <div className="todo-footer">
              {items.length - completed} remaining
            </div>
          )}
        </div>
      </div>
    </>
  );
}