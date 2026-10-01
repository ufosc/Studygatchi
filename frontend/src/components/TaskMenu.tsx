import { useEffect, useRef, useState } from "react";
import "./TaskMenu.css";

type Props = {
  onEdit: () => void;
  onDelete: () => void;
};

export default function TaskMenu({ onEdit, onDelete }: Props) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="task-menu" ref={menuRef}>
      <button
        type="button"
        className="task-menu-trigger"
        aria-label="Task options"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        ⋮
      </button>

      {open && (
        <div className="task-menu-dropdown" role="menu">
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
          >
            Edit
          </button>
          <button
            type="button"
            role="menuitem"
            className="danger"
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}