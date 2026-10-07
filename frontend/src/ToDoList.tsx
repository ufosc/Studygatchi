import { useState } from "react";
import "./App.css";

interface Task {
  id: number;
  name: string;
  description: string;
  category: string;
  due_date: string;
  reward: number;
}

export default function ToDoList() {
  const [items, setItems] = useState<Task[]>([
    {
      id: 1,
      name: "Lock in time",
      description: "",
      category: "",
      due_date: "",
      reward: 0,
    },
    {
      id: 2,
      name: "Read Chapters 2-3",
      description: "",
      category: "",
      due_date: "",
      reward: 0,
    },
    {
      id: 3,
      name: "Write new Draft",
      description: "",
      category: "",
      due_date: "",
      reward: 0,
    },
  ]);

  const [newItem, setNewItem] = useState("");
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const addItem = (event: React.FormEvent) => {
    event.preventDefault();

    if (!newItem.trim()) return;

    const newTask: Task = {
      id: Date.now(),
      name: newItem,
      description: "",
      category: "",
      due_date: "",
      reward: 0,
    };

    setItems((prev) => [...prev, newTask]);
    setNewItem("");
  };

  const checkItem = (id: number) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const saveEditedTask = (event: React.FormEvent) => {
    event.preventDefault();

    if (!editingTask) return;
    if (!editingTask.name.trim()) return;
    if (editingTask.reward < 0 || editingTask.reward > 100) return;

    setItems((prev) =>
      prev.map((item) =>
        item.id === editingTask.id ? editingTask : item
      )
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
                checked={checkedItems[item.id] || false}
                onChange={() => checkItem(item.id)}
              />

              <label htmlFor={`checkbox-${item.id}`}>
                {item.name}
              </label>
            </div>

            <div className="task-buttons">
              <button
                type="button"
                className="todolist-editbutton"
                onClick={() => setEditingTask({ ...item })}
              >
                Edit
              </button>

              <button
                type="button"
                className="todolist-trashbutton"
                onClick={() => removeItem(item.id)}
              >
                Del
              </button>
            </div>
          </li>
        ))}
      </ul>

      {editingTask && (
        <div className="edit-modal-overlay">
          <div className="edit-modal">
            <h2>Edit Task</h2>

            <form onSubmit={saveEditedTask}>
              <label>
                Name
                <input
                  type="text"
                  value={editingTask.name}
                  onChange={(e) =>
                    setEditingTask({
                      ...editingTask,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </label>

              <label>
                Description
                <textarea
                  value={editingTask.description}
                  onChange={(e) =>
                    setEditingTask({
                      ...editingTask,
                      description: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                Category
                <input
                  type="text"
                  value={editingTask.category}
                  onChange={(e) =>
                    setEditingTask({
                      ...editingTask,
                      category: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                Due Date
                <input
                  type="datetime-local"
                  value={editingTask.due_date}
                  onChange={(e) =>
                    setEditingTask({
                      ...editingTask,
                      due_date: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                Reward
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editingTask.reward}
                  onChange={(e) =>
                    setEditingTask({
                      ...editingTask,
                      reward: Number(e.target.value),
                    })
                  }
                />
              </label>

              <div className="edit-modal-buttons">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                >
                  Cancel
                </button>

                <button type="submit">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}