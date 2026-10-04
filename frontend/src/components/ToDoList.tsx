import { useState, useMemo } from "react";
import "./ToDoList.css";

interface ListItem {
  id: string;
  task: string;
  class: string;
  dueDate?: Date; // Optional due date
  isCompleted: boolean;
  percentOfTotalGrade?: number; // this is here for future implemenation with the canvas API
  // I don't expect the user to have to input this everytime.
  urgency: number; // Higher number is more urgent. I won't place restrictions on the number
}
type SortField = "task" | "class" | "dueDate" | "urgency";
type SortOrder = "ascending" | "descending";

const createEmptyListItem = () => ({
  task: "",
  class: "",
  dueDate: new Date(),
  urgency: 0,
  isCompleted: false,
});

const formatDueDate = (date?: Date | string | null) => {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  if (!(d instanceof Date) || isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
};

const toDateInputString = (d?: Date) => {
  if (!d || !(d instanceof Date) || isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseDateInputValue = (val: string) => {
  if (!val) return new Date();
  const parts = val.split("-").map(Number);
  if (parts.length === 3 && !parts.some(isNaN)) {
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }
  return new Date();
};

export default function ToDoList() {
  // TODO:: have these update with the backend
  const [items, setItems] = useState<ListItem[]>([
    {
      task: "Lock in time",
      class: "not CS",
      dueDate: new Date(),
      isCompleted: false,
      id: crypto.randomUUID(),
      urgency: 10,
    },
    {
      task: "Read the Docs",
      class: "CS",
      dueDate: new Date(),
      isCompleted: false,
      id: crypto.randomUUID(),
      urgency: 5,
    },
    {
      task: "Resolve a new Issue",
      class: "CS",
      dueDate: new Date(),
      isCompleted: false,
      id: crypto.randomUUID(),
      urgency: 1,
    },
  ]);

  const [newItem, setNewItem] = useState(createEmptyListItem); // Field entry for a new item
  const [sortField, setSortField] = useState<SortField>("dueDate");
  const [sortOrder, setSortOrder] = useState<SortOrder>("ascending");
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  const addItem = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newItem.task.trim() == "") return;

    setItems((prev) => [
      ...prev,
      {
        task: newItem.task.trim(),
        class: newItem.class.trim(),
        dueDate: newItem.dueDate instanceof Date && !isNaN(newItem.dueDate.getTime()) ? newItem.dueDate : new Date(),
        isCompleted: false,
        id: crypto.randomUUID(),
        urgency: Number(newItem.urgency) || 0,
      },
    ]);
    setNewItem(createEmptyListItem());
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const checkItem = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, isCompleted: !i.isCompleted } : i)),
    );
  };

  const sortedItems = useMemo(() => {
    const mult = sortOrder === "ascending" ? 1 : -1;
    return [...items].sort((a, b) => {
      if (sortField === "task") return mult * a.task.localeCompare(b.task);
      if (sortField === "class") return mult * a.class.localeCompare(b.class);
      if (sortField === "dueDate") {
        const aTime = a.dueDate instanceof Date ? a.dueDate.getTime() : 0;
        const bTime = b.dueDate instanceof Date ? b.dueDate.getTime() : 0;
        return mult * (aTime - bTime);
      }
      if (sortField === "urgency") return mult * (a.urgency - b.urgency);
      return 0;
    });
  }, [items, sortField, sortOrder]);

  return (
    <div className="todolist-container">
      <div className="todolist-header">
        <h1>Goober To Do List</h1>
      </div>

      <div className="todolist-toolbar">
        <div className="todolist-filter-inline">
          <span className="todolist-filter-text">Sort By:</span>
          <select
            className="todolist-filter-select"
            value={sortField}
            onChange={(e) => setSortField(e.target.value as SortField)}
          >
            <option value="task">Task</option>
            <option value="class">Class</option>
            <option value="dueDate">Due Date</option>
            <option value="urgency">Urgency</option>
          </select>
          <span className="todolist-filter-text">in</span>
          <select
            className="todolist-filter-select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
          >
            <option value="ascending">Ascending</option>
            <option value="descending">Descending</option>
          </select>
        </div>
        <button
          type="button"
          className="todolist-add-btn"
          onClick={() => setIsFormOpen((prev) => !prev)}
        >
          +
        </button>
      </div>
      <hr className="todolist-divider" />
      {isFormOpen && (
        <div
          className="todolist-add-item-shadow"
          onClick={() => setIsFormOpen(false)}
        >
          {/*this outer div covers the todo list while the add item form is open*/}
          <div
            className="todolist-add-item"
            onClick={(e) => e.stopPropagation()}
          >
            <form
              onSubmit={(e) => {
                addItem(e);
                setIsFormOpen(false);
              }}
            >
              <div className="todolist-add-item-group">
                <label htmlFor="task-input">Task</label>
                <input
                  id="task-input"
                  type="text"
                  placeholder="Study for Exam"
                  value={newItem.task}
                  onChange={(e) =>
                    setNewItem({ ...newItem, task: e.target.value })
                  }
                />
              </div>
              <div className="todolist-add-item-group">
                <label htmlFor="class-input">Class</label>
                <input
                  type="text"
                  id="class-input"
                  placeholder="Comp Sci"
                  value={newItem.class}
                  onChange={(e) =>
                    setNewItem({ ...newItem, class: e.target.value })
                  }
                />
              </div>
              <div className="todolist-add-item-row">
                <div className="todolist-add-item-group">
                  <label htmlFor="due-date-input">Due Date</label>
                  <input
                    id="due-date-input"
                    type="date"
                    value={toDateInputString(newItem.dueDate)}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        dueDate: parseDateInputValue(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="todolist-add-item-group">
                  <label htmlFor="urgency-input">Urgency</label>
                  <input
                    id="urgency-input"
                    type="number"
                    min="0"
                    value={newItem.urgency}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        urgency:
                          e.target.value === ""
                            ? 0
                            : Math.max(0, parseInt(e.target.value, 10) || 0),
                      })
                    }
                  />
                </div>
              </div>
              <div className="todolist-add-item-actions">
                <button
                  type="button"
                  className="todolist-add-item-cancel-btn"
                  onClick={() => setIsFormOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="todolist-add-item-submit-btn">
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      <ul className="todolist-body">
        {sortedItems.map((item) => {
          const dueDateStr = item.dueDate ? formatDueDate(item.dueDate) : "";
          return (
            <li
              key={item.id}
              className={`todolist-item ${item.isCompleted ? "completed" : ""}`}
            >
              <input
                type="checkbox"
                id={`checkbox-${item.id}`}
                name={item.task}
                checked={item.isCompleted}
                onChange={() => checkItem(item.id)}
              />
              <label
                htmlFor={`checkbox-${item.id}`}
                className="todolist-item-content"
              >
                {Boolean(item.class && item.class.trim()) && (
                  <span className="todolist-item-class">{item.class}</span>
                )}
                <span className="todolist-item-task">
                  {item.task}
                </span>
                {Boolean(dueDateStr) && (
                  <span className="todolist-item-date">{dueDateStr}</span>
                )}
              </label>
              {Number(item.urgency) > 0 && (
                <div className="todolist-item-urgency">
                  <span className="todolist-item-urgency-label">URG</span>
                  <span className="todolist-item-urgency-val">{item.urgency}</span>
                </div>
              )}
              <button
                className="todolist-trash-button"
                onClick={() => removeItem(item.id)}
                aria-label={`Delete task ${item.task}`}
              >
                ✕
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
