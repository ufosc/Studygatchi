import { useState } from "react";
import type { TaskFields } from "../types/task";
import "./TaskForm.css";

type Props = {
  initialValues: TaskFields;
  submitLabel: string;
  onSubmit: (values: TaskFields) => void;
  onCancel: () => void;
};

const toInputDate = (iso: string) => {
  const date = new Date(iso);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

export default function TaskForm({
  initialValues,
  submitLabel,
  onSubmit,
  onCancel,
}: Props) {
  const [values, setValues] = useState<TaskFields>(initialValues);
  const [error, setError] = useState("");

  const update = <K extends keyof TaskFields>(field: K, value: TaskFields[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!values.name.trim()) {
      setError("Name is required.");
      return;
    }
    if (values.reward < 0 || values.reward > 100) {
      setError("Reward must be between 0 and 100.");
      return;
    }
    if (new Date(values.due_date) < new Date()) {
      setError("Due date can't be in the past.");
      return;
    }
    setError("");
    onSubmit({ ...values, name: values.name.trim() });
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <label>
        Name
        <input
          type="text"
          value={values.name}
          onChange={(e) => update("name", e.target.value)}
          autoFocus
        />
      </label>

      <label>
        Description
        <textarea
          rows={3}
          value={values.description}
          onChange={(e) => update("description", e.target.value)}
        />
      </label>

      <label>
        Category
        <input
          type="text"
          value={values.category}
          onChange={(e) => update("category", e.target.value)}
        />
      </label>

      <label>
        Due date
        <input
          type="datetime-local"
          value={toInputDate(values.due_date)}
          onChange={(e) => {
            if (!e.target.value) return;
            update("due_date", new Date(e.target.value).toISOString());
          }}
        />
      </label>

      <label>
        Reward (coins)
        <input
          type="number"
          min={0}
          max={100}
          value={values.reward}
          onChange={(e) => update("reward", Number(e.target.value))}
        />
      </label>

      {error && <p className="task-form-error">{error}</p>}

      <div className="task-form-buttons">
        <button type="button" className="task-form-button" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="task-form-button primary">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}