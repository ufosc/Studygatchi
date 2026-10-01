import { useState } from "react";
import "./App.css";
import type { Task } from "./types/task";

const newTask = (name: string): Task => ({
  id: Date.now() + Math.random(),
  name,
  description: "",
  category: "",
  due_date: new Date(Date.now() + 86400000).toISOString(),
  reward: 10,
  completed: false,
});

export default function ToDoList() {
  const [tasks, setTasks] = useState<Task[]>([
    newTask("Lock in time"),
    newTask("Read Chapters 2-3"),
    newTask("Write new Draft"),
  ]);
  const [newItem, setNewItem] = useState("");

  const addItem = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newItem.trim()) return;
    setTasks((prev) => [...prev, newTask(newItem.trim())]);
    setNewItem("");
  };

  const checkItem = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const removeItem = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
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
        {tasks.map((task) => (
          <li key={task.id} className="todolist-item">
            <div className="wrapper">
              <input
                type="checkbox"
                id={`checkbox-${task.id}`}
                name={task.name}
                checked={task.completed}
                onChange={() => checkItem(task.id)}
              />
              <label htmlFor={`checkbox-${task.id}`}>{task.name}</label>
            </div>
            <button
              className="todolist-trashbutton"
              onClick={() => removeItem(task.id)}
            >
              Del
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}