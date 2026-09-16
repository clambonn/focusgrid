import { QUADRANTS } from "../quadrants";
import type { QuadrantId, Task } from "../types";
import { Quadrant } from "./Quadrant";

interface MatrixProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onFocus: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: (quadrant: QuadrantId) => void;
}

export function Matrix({ tasks, ...handlers }: MatrixProps) {
  return (
    <div className="matrix-wrap">
      <p className="matrix-axis" aria-hidden="true">
        <span>Urgent</span>
        <span>Not urgent</span>
      </p>
      <main className="matrix">
        {QUADRANTS.map((meta) => (
          <Quadrant key={meta.id} meta={meta} tasks={tasks.filter((t) => t.quadrant === meta.id)} {...handlers} />
        ))}
      </main>
    </div>
  );
}
