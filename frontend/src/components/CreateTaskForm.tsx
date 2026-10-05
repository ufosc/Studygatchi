import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

type Props = {
  onCreated: (name: string) => void;
};

function getCsrfToken() {
  const cookies = document.cookie.split("; ");

  for (const cookie of cookies) {
    if (cookie.startsWith("csrftoken=")) {
      return cookie.replace("csrftoken=", "");
    }
  }

  return "";
}

export default function CreateTaskForm({ onCreated }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [reward, setReward] = useState("0");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (name.trim() === "") {
      setMessage("Please enter a name.");
      return;
    }

    if (dueDate === "") {
      setMessage("Please pick a due date.");
      return;
    }

    if (new Date(dueDate) < new Date()) {
      setMessage("The due date has to be in the future.");
      return;
    }

    const rewardNumber = Number(reward);
    if (rewardNumber < 0 || rewardNumber > 100) {
      setMessage("The reward has to be between 0 and 100.");
      return;
    }

    const task: Record<string, string | number> = {
      name: name,
      due_date: new Date(dueDate).toISOString(),
      reward: rewardNumber,
    };

    if (description !== "") {
      task.description = description;
    }
    if (category !== "") {
      task.category = category;
    }

    try {
      const response = await fetch(API_URL + "/create_task/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCsrfToken(),
        },
        credentials: "include",
        body: JSON.stringify(task),
      });

      if (response.status === 201) {
        onCreated(name);
        setMessage("Task created!");
        setName("");
        setDescription("");
        setCategory("");
        setDueDate("");
        setReward("0");
      } else if (response.status === 400) {
        const error = await response.json();
        setMessage("Error: " + JSON.stringify(error));
      } else if (response.status === 401 || response.status === 403) {
        setMessage("You need to be logged in to create a task.");
      } else {
        setMessage("Something went wrong (status " + response.status + ").");
      }
    } catch {
      setMessage("Could not reach the server.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ maxWidth: "400px", margin: "10px auto", textAlign: "left" }}
    >
      <label htmlFor="task-name">Name</label>
      <input
        id="task-name"
        className="form-control"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label htmlFor="task-description">Description</label>
      <textarea
        id="task-description"
        className="form-control"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <label htmlFor="task-category">Category</label>
      <input
        id="task-category"
        className="form-control"
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <label htmlFor="task-due-date">Due Date</label>
      <input
        id="task-due-date"
        className="form-control"
        type="datetime-local"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      <label htmlFor="task-reward">Reward (0 to 100)</label>
      <input
        id="task-reward"
        className="form-control"
        type="number"
        min={0}
        max={100}
        value={reward}
        onChange={(e) => setReward(e.target.value)}
      />

      <p>{message}</p>

      <button className="todolist-addItem" type="submit">
        Create Task
      </button>
    </form>
  );
}
