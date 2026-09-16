import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AddTaskModal } from "./components/AddTaskModal";
import { FocusView } from "./components/FocusView";
import { Matrix } from "./components/Matrix";
import { AtomMark, Icon } from "./components/Icon";
import { isStorageDegraded, loadTasks, readTheme, saveTasks, writeTheme } from "./lib/storage";
import type { QuadrantId, Task } from "./types";

type Dialog = { mode: "add"; quadrant: QuadrantId } | { mode: "edit"; id: string } | null;
type Theme = "light" | "dark";

function newId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function systemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const [dialog, setDialog] = useState<Dialog>(null);
  const [focusId, setFocusId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>(() => readTheme() ?? systemTheme());
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  /* ---- persistence -------------------------------------------------- */
  useEffect(() => {
    const stored = saveTasks(tasks);
    if (!stored && isStorageDegraded()) {
      setMessage("Saving is unavailable here. Tasks last until you close the tab.");
    }
  }, [tasks]);

  /* ---- theme -------------------------------------------------------- */
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toast = useCallback((text: string) => {
    setMessage(text);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setMessage(null), 2600);
  }, []);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  /* ---- task actions -------------------------------------------------- */
  const focusTask = useMemo(() => tasks.find((t) => t.id === focusId) ?? null, [tasks, focusId]);
  const editingTask = useMemo(
    () => (dialog?.mode === "edit" ? tasks.find((t) => t.id === dialog.id) ?? null : null),
    [tasks, dialog],
  );

  const closeDialog = useCallback(() => {
    setDialog(null);
    addButtonRef.current?.focus();
  }, []);

  const toggleTask = useCallback(
    (id: string) => {
      let becameDone = false;
      setTasks((current) =>
        current.map((t) => {
          if (t.id !== id) return t;
          becameDone = !t.completed;
          return { ...t, completed: !t.completed };
        }),
      );
      if (becameDone) toast("Nice. One less thing to carry.");
    },
    [toast],
  );

  const submitDialog = useCallback(
    (title: string, quadrant: QuadrantId) => {
      if (dialog?.mode === "edit") {
        const id = dialog.id;
        setTasks((current) => current.map((t) => (t.id === id ? { ...t, title, quadrant } : t)));
      } else {
        setTasks((current) => [
          ...current,
          { id: newId(), title, quadrant, completed: false, createdAt: new Date().toISOString() },
        ]);
        toast("Added. It's out of your head now.");
      }
      closeDialog();
    },
    [dialog, toast, closeDialog],
  );

  const deleteTask = useCallback(
    (id: string) => {
      setTasks((current) => current.filter((t) => t.id !== id));
      if (focusId === id) setFocusId(null);
      toast("Deleted.");
    },
    [focusId, toast],
  );

  /* ---- keyboard ------------------------------------------------------ */
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;
      if (typing || dialog || focusId) return;
      if (event.key === "n" || event.key === "N") {
        event.preventDefault();
        setDialog({ mode: "add", quadrant: "urgent-important" });
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [dialog, focusId]);

  const openCount = tasks.filter((t) => !t.completed).length;

  return (
    <div className="shell">
      <button
        type="button"
        className="theme-toggle"
        onClick={() => {
          const next: Theme = theme === "dark" ? "light" : "dark";
          setTheme(next);
          writeTheme(next);
        }}
        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        title={theme === "dark" ? "Light mode" : "Dark mode"}
      >
        <Icon name={theme === "dark" ? "sun" : "moon"} size={17} />
      </button>

      <header className="hero">
        <span className="hero-mark">
          <AtomMark size={44} />
        </span>
        <h1 className="hero-name">FocusGrid</h1>
        <p className="hero-tag">Less overwhelm. More clarity.</p>
        <button
          type="button"
          className="btn btn-primary hero-add"
          ref={addButtonRef}
          onClick={() => setDialog({ mode: "add", quadrant: "urgent-important" })}
        >
          <Icon name="plus" size={17} strokeWidth={1.9} />
          Add task
          <kbd className="hero-kbd">N</kbd>
        </button>
      </header>

      <Matrix
        tasks={tasks}
        onToggle={toggleTask}
        onEdit={(id) => setDialog({ mode: "edit", id })}
        onFocus={(id) => setFocusId(id)}
        onDelete={deleteTask}
        onAdd={(quadrant) => setDialog({ mode: "add", quadrant })}
      />

      <footer className="foot">
        <span>
          {openCount === 0 ? "Nothing open right now." : `${openCount} open ${openCount === 1 ? "task" : "tasks"}.`}
        </span>
        <span className="foot-dot" aria-hidden="true" />
        <span>Everything stays on this device. No account, works offline.</span>
      </footer>

      {dialog && !focusTask && (
        <AddTaskModal
          task={editingTask ?? undefined}
          initialQuadrant={dialog.mode === "add" ? dialog.quadrant : (editingTask?.quadrant ?? "urgent-important")}
          onSubmit={submitDialog}
          onDelete={
            dialog.mode === "edit"
              ? () => {
                  deleteTask(dialog.id);
                  closeDialog();
                }
              : undefined
          }
          onFocusTask={
            dialog.mode === "edit"
              ? () => {
                  setFocusId(dialog.id);
                  setDialog(null);
                }
              : undefined
          }
          onClose={closeDialog}
        />
      )}

      {focusTask && (
        <FocusView
          task={focusTask}
          onDone={() => {
            toggleTask(focusTask.id);
            setFocusId(null);
            addButtonRef.current?.focus();
          }}
          onClose={() => {
            setFocusId(null);
            addButtonRef.current?.focus();
          }}
        />
      )}

      <div className="live" role="status" aria-live="polite">
        {message && <p className="toast">{message}</p>}
      </div>
    </div>
  );
}
