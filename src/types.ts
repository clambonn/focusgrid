export type QuadrantId =
  | "urgent-important"
  | "important-not-urgent"
  | "urgent-not-important"
  | "not-urgent-not-important";

export interface Task {
  id: string;
  title: string;
  quadrant: QuadrantId;
  completed: boolean;
  dueDate?: string;
  createdAt: string;
}

export type IconName = "bolt" | "leaf" | "clock" | "star";

export interface QuadrantMeta {
  id: QuadrantId;
  title: string;
  /** The one-line instruction that makes the quadrant self-explanatory. */
  doing: string;
  icon: IconName;
  /** CSS custom property holding the matte surface colour. */
  surface: string;
}
