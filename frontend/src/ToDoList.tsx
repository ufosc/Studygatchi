import { useState } from "react";
import "./App.css";

const HP_REWARD = 10;
const MAX_HP = 100;

type Props = {
  currentHealth: number;
  setHealth: (arg0: number) => void;
};

export default function ToDoList({ currentHealth, setHealth }: Props) {
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
    const wasChecked = checkedItems[item];
    setCheckedItems((prev) => ({ ...prev, [item]: !prev[item] }));

    // Completing a task (unchecked -> checked) restores some of Goober's HP
    if (!wasChecked) {
      setHealth(Math.min(currentHealth + HP_REWARD, MAX_HP));
    }
  };

  const removeItem = (item: string) => {
    setItems((prev) => prev.filter((i) => i !== item));
    setCheckedItems((prev) => {
      const copy = { ...prev };
      delete copy[item];
      return copy;
    });
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
              onClick={() => removeItem(item)}
            >
              Del
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
