import { useState } from "react";
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

  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

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

  // Issue #99: allow users to remove a task without receiving a reward.
  // A confirmation modal helps prevent accidental deletion.
  const confirmDelete = () => {
    if (!taskToDelete) return;

    setItems((prev) => prev.filter((item) => item !== taskToDelete));

    setCheckedItems((prev) => {
      const copy = { ...prev };
      delete copy[taskToDelete];
      return copy;
    });

    setTaskToDelete(null);
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
              onClick={() => setTaskToDelete(item)}
              aria-label={`Delete ${item}`}
            >
              Del
            </button>
          </li>
        ))}
      </ul>

      {taskToDelete && (
        <div className="delete-modal-overlay">
          <div
            className="delete-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
          >
            <h2 id="delete-modal-title">Delete task?</h2>

            <p>
              Are you sure you want to delete <strong>{taskToDelete}</strong>?
            </p>

            <div className="delete-modal-buttons">
              <button
                className="delete-modal-cancel"
                onClick={() => setTaskToDelete(null)}
              >
                Cancel
              </button>

              <button
                className="delete-modal-confirm"
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