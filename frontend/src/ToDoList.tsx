import { useEffect, useState } from "react";
import "./App.css";

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
  // Task awaiting delete confirmation (null = modal closed).
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  // Open right-click context menu and its screen position (null = closed).
  const [contextMenu, setContextMenu] = useState<{
    item: string;
    x: number;
    y: number;
  } | null>(null);

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

  // Open the confirmation modal for a task (deleting never grants a reward).
  const requestDelete = (item: string) => {
    setContextMenu(null);
    setPendingDelete(item);
  };

  const confirmDelete = () => {
    if (pendingDelete !== null) removeItem(pendingDelete);
    setPendingDelete(null);
  };

  const cancelDelete = () => setPendingDelete(null);

  // Escape cancels the modal / closes the context menu; an outside click or
  // another right-click closes an open context menu.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setContextMenu(null);
        setPendingDelete(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!contextMenu) return;
    const close = () => setContextMenu(null);
    window.addEventListener("click", close);
    window.addEventListener("contextmenu", close);
    return () => {
      window.removeEventListener("click", close);
      window.removeEventListener("contextmenu", close);
    };
  }, [contextMenu]);

  return (
    <div>
      <div className="todolist-logo">
        <h1>Goober To Do List</h1>
      </div>

      <form className="Add-item" onSubmit={addItem}>
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
        <button className="todolist-addItem" type="submit">
          Add
        </button>
      </form>

      <ul
        style={{
          maxWidth: "400px",
          margin: "0 auto",
          listStyleType: "none",
          padding: 0,
        }}
      >
        {items.map((item) => (
          <li
            key={item}
            className="todolist-item"
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setContextMenu({ item, x: e.clientX, y: e.clientY });
            }}
          >
            <div className="wrapper">
              <input
                type="checkbox"
                id={`checkbox-${item}`}
                name={item}
                checked={checkedItems[item]}
                onChange={() => checkItem(item)}
              />
              <label htmlFor={`checkbox-${item}`}>{item}</label>
            </div>
            <button
              className="todolist-trashbutton"
              aria-label={`Delete ${item}`}
              title="Delete task"
              onClick={() => requestDelete(item)}
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      {contextMenu && (
        <div
          className="todolist-context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={() => requestDelete(contextMenu.item)}>
            Delete
          </button>
        </div>
      )}

      {pendingDelete !== null && (
        <div className="todolist-modal-overlay" onClick={cancelDelete}>
          <div
            className="todolist-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="todolist-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <p id="todolist-modal-title" className="todolist-modal-message">
              Delete "{pendingDelete}"? This can't be undone.
            </p>
            <div className="todolist-modal-actions">
              <button
                className="todolist-modal-cancel"
                autoFocus
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button
                className="todolist-modal-delete"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
