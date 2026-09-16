import type { QuadrantId, QuadrantMeta } from "./types";

export const QUADRANTS: QuadrantMeta[] = [
  {
    id: "urgent-important",
    title: "Urgent & Important",
    doing: "Do it now.",
    icon: "bolt",
    surface: "--q1",
  },
  {
    id: "important-not-urgent",
    title: "Important & Not Urgent",
    doing: "Plan a time.",
    icon: "leaf",
    surface: "--q2",
  },
  {
    id: "urgent-not-important",
    title: "Urgent & Not Important",
    doing: "Handle quickly.",
    icon: "clock",
    surface: "--q3",
  },
  {
    id: "not-urgent-not-important",
    title: "Not Urgent & Not Important",
    doing: "Let it go.",
    icon: "star",
    surface: "--q4",
  },
];

export const QUADRANT_IDS = QUADRANTS.map((q) => q.id);

export function quadrantMeta(id: QuadrantId): QuadrantMeta {
  return QUADRANTS.find((q) => q.id === id) ?? QUADRANTS[0];
}
