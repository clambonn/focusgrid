import { useEffect, useRef } from "react";
import { quadrantMeta } from "../quadrants";
import type { Task } from "../types";
import { AtomMark, Icon, TrajectoryLine } from "./Icon";

interface FocusViewProps {
  task: Task;
  onDone: () => void;
  onClose: () => void;
}

export function FocusView({ task, onDone, onClose }: FocusViewProps) {
  const meta = quadrantMeta(task.quadrant);
  const doneRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    doneRef.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="focus" role="dialog" aria-modal="true" aria-label="Focus">
      <div className="focus-atom" aria-hidden="true">
        <AtomMark size={34} />
      </div>

      <p className="focus-eyebrow">One thing at a time</p>
      <h2 className="focus-title">{task.title}</h2>
      <p className="focus-where">
        <Icon name={meta.icon} size={15} />
        {meta.title}
      </p>

      <div className="focus-actions">
        <button type="button" className="btn btn-primary" onClick={onDone} ref={doneRef}>
          <Icon name="check" size={16} strokeWidth={2.4} />
          Mark as done
        </button>
        <button type="button" className="link" onClick={onClose}>
          <Icon name="arrowLeft" size={15} />
          Back to the grid
        </button>
      </div>

      <TrajectoryLine className="focus-trace" />
    </div>
  );
}
