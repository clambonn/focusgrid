import { useEffect, useRef, useState } from "react";
import { QUADRANTS } from "../quadrants";
import type { QuadrantId, Task } from "../types";
import { Icon } from "./Icon";

interface AddTaskModalProps {
  /** Present when editing, absent when adding. */
  task?: Task;
  initialQuadrant: QuadrantId;
  onSubmit: (title: string, quadrant: QuadrantId) => void;
  onDelete?: () => void;
  onFocusTask?: () => void;
  onClose: () => void;
}

export function AddTaskModal({ task, initialQuadrant, onSubmit, onDelete, onFocusTask, onClose }: AddTaskModalProps) {
  const isEditing = Boolean(task);
  const [title, setTitle] = useState(task?.title ?? "");
  const [quadrant, setQuadrant] = useState<QuadrantId>(task?.quadrant ?? initialQuadrant);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  // Keep focus inside the dialog without pulling in a library.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusables = dialogRef.current.querySelectorAll<HTMLElement>("button, input, [href], select, textarea");
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  function submit() {
    const value = title.trim();
    if (!value) {
      inputRef.current?.focus();
      return;
    }
    onSubmit(value, quadrant);
  }

  return (
    <div className="scrim" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-heading" ref={dialogRef}>
        <h2 className="sheet-heading" id="sheet-heading">
          {isEditing ? "Edit task" : "What do you need to do?"}
        </h2>

        <input
          ref={inputRef}
          id="task-title"
          className="sheet-input"
          type="text"
          maxLength={120}
          autoComplete="off"
          placeholder="Finish the DEPI assignment"
          aria-label="Task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              submit();
            }
          }}
        />

        <p className="sheet-label" id="quadrant-label">
          Where does it belong?
        </p>
        <div className="chips" role="radiogroup" aria-labelledby="quadrant-label">
          {QUADRANTS.map((q) => (
            <button
              key={q.id}
              type="button"
              role="radio"
              aria-checked={q.id === quadrant}
              className="chip"
              onClick={() => setQuadrant(q.id)}
            >
              <span className="chip-dot" style={{ background: `var(${q.surface})` }} />
              <span className="chip-text">
                <span className="chip-title">{q.title}</span>
                <span className="chip-doing">{q.doing}</span>
              </span>
              <span className="chip-icon">
                <Icon name={q.icon} size={16} />
              </span>
            </button>
          ))}
        </div>

        <div className="sheet-actions">
          {isEditing && onDelete && (
            <button type="button" className="link link-danger" onClick={onDelete}>
              Delete
            </button>
          )}
          {isEditing && onFocusTask && !task?.completed && (
            <button type="button" className="link" onClick={onFocusTask}>
              Focus on this
            </button>
          )}
          <button type="button" className="btn btn-primary sheet-submit" onClick={submit}>
            {isEditing ? "Save changes" : "Add task"}
          </button>
        </div>
        <p className="sheet-hint">Enter to save · Esc to close</p>
      </div>
    </div>
  );
}
