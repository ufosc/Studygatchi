import { useState } from "react";
import "./App.css";

export default function ToDoList() {
  const [items, setItems] = useState([
    "Lock in time",
    "Read Chapters 2-3",
    "Write new Draft",
  ]);
  const [newItem, setNewItem] = useState("");
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(
    () =>
      items.reduce((acc, item) => {
        acc[item] = false;
        return acc;
      }, {} as Record<string, boolean>)
  );

  const addItem = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedItem = newItem.trim();

    if (!trimmedItem) return;

    setItems((prev) => [...prev, trimmedItem]);
    setCheckedItems((prev) => ({ ...prev, [trimmedItem]: false }));
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

    if (editingItem === item) {
      setEditingItem(null);
      setEditText("");
    }
  };

  const startEditing = (item: string) => {
    setEditingItem(item);
    setEditText(item);
  };

  const cancelEditing = () => {
    setEditingItem(null);
    setEditText("");
  };

  const saveEditedItem = () => {
    if (editingItem === null) return;

    const trimmedText = editText.trim();
    if (!trimmedText) return;

    setItems((prev) =>
      prev.map((item) => (item === editingItem ? trimmedText : item))
    );

    setCheckedItems((prev) => {
      const copy = { ...prev };
      const wasChecked = copy[editingItem] ?? false;

      delete copy[editingItem];
      copy[trimmedText] = wasChecked;

      return copy;
    });

    setEditingItem(null);
    setEditText("");
  };

  const handleEditKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      saveEditedItem();
    } else if (event.key === "Escape") {
      cancelEditing();
    }
  };

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
          <li key={item} className="todolist-item">
            {editingItem === item ? (
              <input
                className="todolist-edit-input"
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={handleEditKeyDown}
                autoFocus
                aria-label={`Edit ${item}`}
              />
            ) : (
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
            )}

            <div className="todolist-actions">
              {editingItem === item ? (
                <>
                  <button
                    className="todolist-savebutton"
                    type="button"
                    onClick={saveEditedItem}
                    disabled={!editText.trim()}
                  >
                    Save
                  </button>
                  <button
                    className="todolist-cancelbutton"
                    type="button"
                    onClick={cancelEditing}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="todolist-editbutton"
                    type="button"
                    onClick={() => startEditing(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="todolist-trashbutton"
                    type="button"
                    onClick={() => removeItem(item)}
                  >
                    Del
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
