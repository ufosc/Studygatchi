import { useState } from "react";
import "./App.css";

class Task {
  constructor(
    public id: number,
    public name: string,
    public category = "",
    public due_date = "",
    public description = "",
    public reward = 0,
  ) {}
}

const initialTasks = [
  new Task(1, "Lock in time"),
  new Task(2, "Read Chapters 2-3"),
  new Task(3, "Write new Draft"),
];

export default function ToDoList() {
  const [items, setItems] = useState(initialTasks);
  const [newItem, setNewItem] = useState("");
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>(
    () =>
      initialTasks.reduce((acc, item) => {
        acc[item.id] = false;
        return acc;
      }, {} as Record<number, boolean>)
  );
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [rewardInput, setRewardInput] = useState("");
  const [nextTaskId, setNextTaskId] = useState(initialTasks.length + 1);

  const addItem = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newItem.trim()) return;

    const task: Task = {
      id: nextTaskId,
      name: newItem.trim(),
      category: "",
      due_date: "",
      description: "",
      reward: 0,
    };
    setItems((prev) => [...prev, task]);
    setCheckedItems((prev) => ({ ...prev, [task.id]: false }));
    setNextTaskId((prev) => prev + 1);
    setNewItem("");
  };

  const checkItem = (taskId: number) => {
    setCheckedItems((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const removeItem = (taskId: number) => {
    setItems((prev) => prev.filter((item) => item.id !== taskId));
    setCheckedItems((prev) => {
      const copy = { ...prev };
      delete copy[taskId];
      return copy;
    });
  };

  const updateEditingTask = (
    field: "name" | "category" | "due_date" | "description",
    value: string
  ) => {
    if (!editingTask) return;

    const updatedTask = new Task(
      editingTask.id,
      editingTask.name,
      editingTask.category,
      editingTask.due_date,
      editingTask.description,
      editingTask.reward
    );

    if (field === "name") updatedTask.name = value;
    if (field === "category") updatedTask.category = value;
    if (field === "due_date") updatedTask.due_date = value;
    if (field === "description") updatedTask.description = value;

    setEditingTask(updatedTask);
  };

  const saveTask = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingTask || !editingTask.name.trim()) {
      return;
    }

    setItems((items) =>
      items.map((item) => {
        if (item.id !== editingTask.id) {
          return item;
        }

        return new Task(
          editingTask.id,
          editingTask.name.trim(),
          editingTask.category,
          editingTask.due_date,
          editingTask.description,
          Number(rewardInput)
        );
      })
    );

    setEditingTask(null);
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
          <li key={item.id} className="todolist-item">
            <div className="wrapper">
              <input
                type="checkbox"
                id={`checkbox-${item.id}`}
                name={item.name}
                checked={checkedItems[item.id] ?? false}
                onChange={() => checkItem(item.id)}
              />
              <label htmlFor={`checkbox-${item.id}`}>{item.name}</label>
            </div>
            <div className="todolist-actions">
              <button
                className="todolist-editbutton"
                type="button"
                aria-label={`Edit task ${item.name}`}
                onClick={() => {
                  setEditingTask({ ...item });
                  setRewardInput(String(item.reward));
                }}
              >
                <span aria-hidden="true">&#9776;</span>
              </button>
              <button
                className="todolist-trashbutton"
                type="button"
                onClick={() => removeItem(item.id)}
              >
                Del
              </button>
            </div>
          </li>
        ))}
      </ul>

      {editingTask && (
        <div
          className="task-edit-backdrop"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) setEditingTask(null);
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") setEditingTask(null);
          }}
        >
          <section
            className="task-edit-window"
            role="dialog"
            aria-modal="true"
            aria-labelledby="task-edit-title"
          >
            <h2 id="task-edit-title">Edit task</h2>
            <form onSubmit={saveTask}>
              <label>
                Name
                <input
                  autoFocus
                  type="text"
                  value={editingTask.name}
                  required
                  onChange={(event) =>
                    updateEditingTask("name", event.target.value)
                  }
                />
              </label>
              <label>
                Category
                <input
                  type="text"
                  value={editingTask.category}
                  onChange={(event) =>
                    updateEditingTask("category", event.target.value)
                  }
                />
              </label>
              <label>
                Due date
                <input
                  type="datetime-local"
                  value={editingTask.due_date}
                  onChange={(event) =>
                    updateEditingTask("due_date", event.target.value)
                  }
                />
              </label>
              <label>
                Description
                <textarea
                  value={editingTask.description}
                  onChange={(event) =>
                    updateEditingTask("description", event.target.value)
                  }
                />
              </label>
              <label>
                Reward
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={rewardInput}
                  onChange={(event) => setRewardInput(event.target.value)}
                />
              </label>
              <div className="task-edit-actions">
                <button
                  type="button"
                  className="todolist-addItem"
                  onClick={() => setEditingTask(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="todolist-addItem">
                  Save changes
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
