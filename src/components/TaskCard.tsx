import type { Task } from "../types";
import { Icon } from "./Icon";

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onFocus: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onToggle, onEdit, onFocus, onDelete }: TaskCardProps) {
  return (
    <li className={`task${task.completed ? " is-done" : ""}`}>
      <button
        type="button"
        role="checkbox"
        aria-checked={task.completed}
        className="task-check"
        onClick={() => onToggle(task.id)}
        aria-label={`${task.completed ? "Mark as not done" : "Mark as done"}: ${task.title}`}
      >
        <span className="task-box">
          <Icon name="check" size={11} strokeWidth={3} />
        </span>
      </button>

      <button type="button" className="task-title" onClick={() => onEdit(task.id)} title={task.title}>
        {task.title}
      </button>

      <span className="task-actions">
        {!task.completed && (
          <button type="button" className="task-action" onClick={() => onFocus(task.id)} aria-label={`Focus on ${task.title}`} title="Focus on this">
            <Icon name="target" size={16} />
          </button>
        )}
        <button type="button" className="task-action" onClick={() => onEdit(task.id)} aria-label={`Edit or move ${task.title}`} title="Edit or move">
          <Icon name="edit" size={16} />
        </button>
        <button type="button" className="task-action" onClick={() => onDelete(task.id)} aria-label={`Delete ${task.title}`} title="Delete">
          <Icon name="trash" size={16} />
        </button>
      </span>
    </li>
  );
}
