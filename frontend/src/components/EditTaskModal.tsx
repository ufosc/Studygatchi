import { useEffect } from "react";
import type { Task, TaskFields } from "../types/task";
import TaskForm from "./TaskForm";
import "./EditTaskModal.css";

type Props = {
    task: Task;
    error?: string;
    onSave: (values: TaskFields) => void;
    onClose: () => void;
};

export default function EditTaskModal({ task, error, onSave, onClose }: Props) {    
    useEffect(() => {
        const handleKey = (event: KeyboardEvent) => {
        if (event.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [onClose]);

    return (
        <div className="modal-backdrop" onMouseDown={onClose}>
        <div
            className="modal-box"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-task-title"
            onMouseDown={(e) => e.stopPropagation()}
        >
            <h2 id="edit-task-title" className="modal-title">
            Edit Task
            </h2>
            {error && <p className="modal-error">{error}</p>}
            <TaskForm
            initialValues={{
                name: task.name,
                description: task.description,
                category: task.category,
                due_date: task.due_date,
                reward: task.reward,
            }}
            submitLabel="Save"
            onSubmit={onSave}
            onCancel={onClose}
            />
        </div>
        </div>
    );
    }