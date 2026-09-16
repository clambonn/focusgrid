import type { QuadrantId, Task } from "../types";
import { QUADRANT_IDS } from "../quadrants";

export const STORAGE_KEY = "focusgrid.tasks.v1";
export const THEME_KEY = "focusgrid.theme";

/**
 * Persistence is deliberately dumb: one JSON array in localStorage.
 * If localStorage is missing, full, or corrupted we degrade to an
 * in-memory copy so the app never breaks in the user's hands.
 */
let memoryOnly = false;
let memoryTasks: Task[] = [];

export function isStorageDegraded(): boolean {
  return memoryOnly;
}

function isTask(value: unknown): value is Task {
  if (typeof value !== "object" || value === null) return false;
  const t = value as Record<string, unknown>;
  return (
    typeof t.id === "string" &&
    typeof t.title === "string" &&
    typeof t.quadrant === "string" &&
    QUADRANT_IDS.includes(t.quadrant as QuadrantId)
  );
}

function normalise(t: Task): Task {
  return {
    id: t.id,
    title: t.title,
    quadrant: t.quadrant,
    completed: Boolean(t.completed),
    dueDate: typeof t.dueDate === "string" ? t.dueDate : undefined,
    createdAt: typeof t.createdAt === "string" ? t.createdAt : new Date().toISOString(),
  };
}

export function loadTasks(): Task[] {
  if (memoryOnly) return memoryTasks;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error("stored value is not a list");
    // Keep every entry that still makes sense, drop the rest.
    return parsed.filter(isTask).map(normalise);
  } catch (error) {
    console.warn("FocusGrid: saved tasks could not be read, starting with an empty grid.", error);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* nothing else to do */
    }
    return [];
  }
}

/** Returns false when the write had to fall back to memory. */
export function saveTasks(tasks: Task[]): boolean {
  if (memoryOnly) {
    memoryTasks = tasks;
    return false;
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch (error) {
    console.warn("FocusGrid: could not write to localStorage, keeping tasks in memory.", error);
    memoryOnly = true;
    memoryTasks = tasks;
    return false;
  }
}

export function readTheme(): "light" | "dark" | null {
  try {
    const value = localStorage.getItem(THEME_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

export function writeTheme(theme: "light" | "dark"): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* theme preference is nice to have, not essential */
  }
}
