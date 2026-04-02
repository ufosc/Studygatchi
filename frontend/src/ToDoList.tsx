import { useState, useMemo } from "react";
import "./App.css";

type ToDoItem = {
  id: number;
  name: string;
  deadline: string;
  estimatedMinutes: number;
}

type SortOption = "alphabetical" | "deadline" | "estimatedMinutes";

let nextId = 0;

export default function ToDoList() {
  const [items, setItems] = useState<ToDoItem[]>([
    { id: nextId++, name: "Lock in time", deadline: "2026-02-15", estimatedMinutes: 60 },
    { id: nextId++, name: "Read Chapters 2-3", deadline: "2026-02-16", estimatedMinutes: 120 },
    { id: nextId++, name: "Write new Draft", deadline: "2026-02-17", estimatedMinutes: 90 },
  ]);

  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [newName, setNewName] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [newEstimatedMinutes, setNewEstimatedMinutes] = useState("");

  const [sortBy, setSortBy] = useState<SortOption>("alphabetical");
  const [showDropdown, setShowDropdown] = useState(false);

  const addItem = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newName.trim()) return;

    const item: ToDoItem = {
      id: nextId++,
      name: newName.trim(),
      deadline: newDeadline.trim(),
      estimatedMinutes: Number(newEstimatedMinutes),
    };

    setItems((prev) => [...prev, item]);
    setCheckedItems((prev) => ({ ...prev, [item.id]: false }));
    setNewName("");
    setNewDeadline("");
    setNewEstimatedMinutes("");
  };

  const checkItem = (id: number) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setCheckedItems((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const displayedItems = useMemo(() => {

    const sorted = [...items];
    if (sortBy === "alphabetical") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "deadline") {
      sorted.sort((a, b) => a.deadline.localeCompare(b.deadline));
    } else if (sortBy === "estimatedMinutes") {
      sorted.sort((a, b) => a.estimatedMinutes - b.estimatedMinutes);
    }
    return sorted;
  }, [items, sortBy]);

  return (
    <div>
      <div className="todolist-logo">
        <h1>Goober To Do List</h1>
      </div>

      <form className="Add-item" onSubmit={addItem} style={{ display: "flex", flexWrap: "wrap", gap: "6px", justifyContent: "center" }}>
        <input
          type="text"
          placeholder="Task name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <input
          type="date"
          value={newDeadline}
          onChange={(e) => setNewDeadline(e.target.value)}
          title="Deadline"
        />
        <input
          type="number"
          min="0"
          placeholder="Est. min"
          value={newEstimatedMinutes}
          onChange={(e) => setNewEstimatedMinutes(e.target.value)}
          style={{ width: "80px" }}
        />
        
        <button className="todolist-addItem" type="submit">Add</button>
      </form>

      <div style={{ maxWidth: "400px", margin: "10px auto 0", display: "flex", justifyContent: "flex-end", position: "relative" }}>
        <button
          className="todolist-addItem"
          onClick={() => setShowDropdown((v) => !v)}
          style={{ fontSize: "12px" }}
        >
          Filter / Sort ▾
        </button>

        {showDropdown && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              right: 0,
              background: "#2a2a2a",
              border: "1px solid #555",
              borderRadius: "6px",
              padding: "10px",
              zIndex: 10,
              minWidth: "180px",
              textAlign: "left",
            }}
          >
            <p style={{ margin: "0 0 4px", fontWeight: "bold", fontSize: "0.85rem" }}>Sort by</p>
            {(["alphabetical", "deadline", "estimatedMinutes"] as SortOption[]).map((opt) => (
              <label key={opt} style={{ display: "block", fontSize: "0.85rem", cursor: "pointer", marginBottom: "2px" }}>
                <input
                  type="radio"
                  name="sort"
                  checked={sortBy === opt}
                  onChange={() => setSortBy(opt)}
                  style={{ position: "static", opacity: 1, width: "auto", height: "auto", marginRight: "6px" }}
                />
                {opt === "alphabetical" ? "Alphabetical" : opt === "deadline" ? "Earliest Deadline" : "Estimated Time"}
              </label>
            ))}

          </div>
        )}
      </div>

      <ul
        style={{
          maxWidth: "400px",
          margin: "0 auto",
          listStyleType: "none",
          padding: 0,
        }}
      >
        {displayedItems.map((item) => (
          <li key={item.id} className="todolist-item">
            <div className="wrapper">
              <input
                type="checkbox"
                id={`checkbox-${item.id}`}
                name={item.name}
                checked={!!checkedItems[item.id]}
                onChange={() => checkItem(item.id)}
              />
              <label htmlFor={`checkbox-${item.id}`}>
                {item.name}
                <span style={{ fontSize: "0.75rem", color: "#999", marginLeft: "8px" }}>
                  {item.deadline && <span style={{marginRight: "8px"}}> {item.deadline}</span>}
                  {item.estimatedMinutes && <span style={{marginRight: "8px"}}> {item.estimatedMinutes} minutes</span>}
                </span>
              </label>
            </div>
            <button
              className="todolist-trashbutton"
              onClick={() => removeItem(item.id)}
            >
              Del
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
