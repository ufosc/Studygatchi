import { useState } from "react";
import "./ToDoList.css";

interface ListItem {
  id: string;
  task: string;
  class: string;
  dueDate: Date; // I am choosing to have every item to force a due date.
  // I think even if the item is optional the user should have a date to achive it
  isCompleted: boolean;
  percentOfTotalGrade?: number; // this is here for future implemenation with the canvas API
  // I don't expect the user to have to input this everytime.
  urgency: number; // Higher number is more urgent. I won't place restrictions on the number
}
type SortField = "task" | "class" | "dueDate" | "urgency";
type SortOrder = "ascending" | "descending";

const emptyListItem = {
  task: "",
  class: "",
  dueDate: new Date(),
  urgency: 0,
  isCompleted: false,
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

  const [newItem, setNewItem] = useState(emptyListItem); // Field entry for a new item
  const [sortField, setSortField] = useState<SortField>("dueDate");
  const [sortOrder, setSortOrder] = useState<SortOrder>("ascending");
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  const addItem = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newItem.task.trim() == "") return;

    setItems((prev) => [
      ...prev,
      {
        task: newItem.task,
        class: "Who knows rn",
        dueDate: new Date(),
        isCompleted: false,
        id: crypto.randomUUID(),
        urgency: 0,
      },
    ]);
    setNewItem(emptyListItem);
  };

  const removeItem = (item: ListItem) => {
    setItems((prev) => prev.filter((i) => i !== item));
  };

  const checkItem = (item: ListItem) => {
    setItems((prev) =>
      prev.map((i) => (i === item ? { ...i, isCompleted: !i.isCompleted } : i)),
    );
  };

  const sortItems = (field: SortField, order: SortOrder) => {
    return [...items].sort((a, b) => {
      if (field === "task")
        return order == "ascending"
          ? a.task.localeCompare(b.task)
          : b.task.localeCompare(a.task);
      if (field == "class")
        return order == "ascending"
          ? a.class.localeCompare(b.class)
          : b.class.localeCompare(a.class);
      if (field == "dueDate")
        return order == "ascending"
          ? a.dueDate.getTime() - b.dueDate.getTime()
          : b.dueDate.getTime() - a.dueDate.getTime();
      if (field == "urgency")
        return order == "ascending"
          ? a.urgency - b.urgency
          : b.urgency - a.urgency;
      return 0;
    });
  };

  const sortedItems = sortItems(sortField, sortOrder); // the array of items to be displayed on the screen

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
                    value={newItem.dueDate.toISOString().split("T")[0]}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        dueDate: new Date(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="todolist-add-item-group">
                  <label htmlFor="urgency-input">Urgency</label>
                  <input
                    id="urgency-input"
                    type="number"
                    value={newItem.urgency}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        urgency: parseInt(e.target.value),
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
        {sortedItems.map((item) => (
          <li key={item.id} className="todolist-item">
            <input
              type="checkbox"
              id={`checkbox-${item.id}`}
              name={item.task}
              checked={item.isCompleted}
              onChange={() => checkItem(item)}
            />
            <label htmlFor={`checkbox-${item.id}`}>{item.task}</label>
            <button
              className="todolist-trash-button"
              onClick={() => removeItem(item)}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
