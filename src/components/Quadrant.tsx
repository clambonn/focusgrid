import type { QuadrantMeta, Task } from "../types";
import { Icon, TrajectoryLine } from "./Icon";
import { TaskCard } from "./TaskCard";

interface QuadrantProps {
  meta: QuadrantMeta;
  tasks: Task[];
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onFocus: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: (quadrant: QuadrantMeta["id"]) => void;
}

export function Quadrant({ meta, tasks, onToggle, onEdit, onFocus, onDelete, onAdd }: QuadrantProps) {
  const open = tasks.filter((t) => !t.completed).length;
  const ordered = [...tasks].sort((a, b) => Number(a.completed) - Number(b.completed));

  const count = open === 0 ? (tasks.length ? "All done" : "Nothing yet") : `${open} ${open === 1 ? "task" : "tasks"}`;

  return (
    <section className="quad" data-quadrant={meta.id} aria-labelledby={`quad-${meta.id}`}>
      <header className="quad-head">
        <span className="quad-icon">
          <Icon name={meta.icon} size={19} />
        </span>
        <div className="quad-heading">
          <h2 className="quad-title" id={`quad-${meta.id}`}>
            {meta.title}
          </h2>
          <p className="quad-doing">{meta.doing}</p>
        </div>
        <button type="button" className="quad-add" onClick={() => onAdd(meta.id)} aria-label={`Add a task to ${meta.title}`} title="Add here">
          <Icon name="plus" size={16} strokeWidth={1.8} />
        </button>
      </header>

      <p className="quad-count">{count}</p>

      {ordered.length > 0 ? (
        <ul className="task-list">
          {ordered.map((task) => (
            <TaskCard key={task.id} task={task} onToggle={onToggle} onEdit={onEdit} onFocus={onFocus} onDelete={onDelete} />
          ))}
        </ul>
      ) : (
        <div className="quad-empty">
          <p>Nothing here yet. That's okay.</p>
          <TrajectoryLine className="quad-trace" />
        </div>
      )}
    </section>
  );
}
