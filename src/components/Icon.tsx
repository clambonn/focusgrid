import type { ReactElement } from "react";

interface IconProps {
  name: string;
  size?: number;
  strokeWidth?: number;
}

const PATHS: Record<string, ReactElement> = {
  bolt: <path d="M13 2.5 4.8 13.8h5.6L9.8 21.5 18 10.2h-5.6l.6-7.7Z" />,
  leaf: (
    <>
      <path d="M4.5 19.8c9.6 2 15.4-3.9 15.4-15.6-7.8 0-13.6 3-14.5 8.8-.4 2.4.4 4.8-.9 6.8Z" />
      <path d="M8.4 17.6c1-3.9 3.9-6.8 7.7-8.7" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M12 7.2V12l3 2" />
    </>
  ),
  star: <path d="m12 3.4 2.5 5.3 5.8.8-4.2 4.1 1 5.9-5.1-2.8-5.1 2.8 1-5.9-4.2-4.1 5.8-.8L12 3.4Z" />,
  plus: <path d="M12 5.2v13.6M5.2 12h13.6" />,
  check: <path d="m4.5 12.2 5 5 10-10.4" />,
  moon: <path d="M20 14.6A8.6 8.6 0 0 1 9.4 4 8.6 8.6 0 1 0 20 14.6Z" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.6v2.2M12 19.2v2.2M4.4 4.4l1.6 1.6M18 18l1.6 1.6M2.6 12h2.2M19.2 12h2.2M4.4 19.6 6 18M18 6l1.6-1.6" />
    </>
  ),
  edit: (
    <>
      <path d="M4.5 19.5h4l9.2-9.2a2.3 2.3 0 0 0-3.3-3.3L5.2 16.2l-.7 3.3Z" />
    </>
  ),
  trash: (
    <>
      <path d="M4.8 6.8h14.4M9.6 6.8V4.9h4.8v1.9M6.7 6.8l.9 12.3h8.8l.9-12.3" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.4" />
      <circle cx="12" cy="12" r="3.4" />
    </>
  ),
  arrowLeft: <path d="M10 5.5 3.8 12l6.2 6.5M4.4 12h15.8" />,
};

export function Icon({ name, size = 18, strokeWidth = 1.6 }: IconProps) {
  const path = PATHS[name];
  if (!path) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {path}
    </svg>
  );
}

/** Three-orbit atom: the whole identity in one mark. */
export function AtomMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true" focusable="false">
      <g stroke="currentColor" strokeWidth="1.5" opacity="0.9">
        <ellipse cx="20" cy="20" rx="16" ry="6.6" />
        <ellipse cx="20" cy="20" rx="16" ry="6.6" transform="rotate(60 20 20)" />
        <ellipse cx="20" cy="20" rx="16" ry="6.6" transform="rotate(120 20 20)" />
      </g>
      <circle cx="20" cy="20" r="3.1" fill="currentColor" />
    </svg>
  );
}

/**
 * A single racing line: long straight, one apex, exit. Used in empty
 * quadrants and under the focus view. Never more than a hairline.
 */
export function TrajectoryLine({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 80" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M-6 68h58c26 0 38-9 54-27C177 26 186 20 206 20"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path d="M-6 74h44" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity="0.45" />
      <circle cx="106" cy="41" r="2.1" fill="currentColor" />
    </svg>
  );
}
