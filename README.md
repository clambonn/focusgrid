# FocusGrid

A calm Eisenhower matrix.for turning a crowded task list into one clear next step. Four quadrants, one thing at a time.  
Offline, local-only, no account, no backend.

> Less overwhelm. More clarity.

---

## Why I Built FocusGrid

I built FocusGrid because traditional productivity tools can sometimes feel like another task to manage.

When there are too many things competing for your attention, the hardest part is not always doing the work — it is figuring out **what actually deserves your attention right now**.

I wanted a small tool that answers one simple question:

> **What should I focus on right now?**

So I built FocusGrid around the Eisenhower Matrix, with only four simple spaces:

- **Urgent & Important** — Do it now.
- **Important & Not Urgent** — Plan it.
- **Urgent & Not Important** — Handle it quickly.
- **Not Urgent & Not Important** — Let it go.

There are no complicated projects, dashboards, accounts, or productivity systems to maintain.

Just add a task, put it where it belongs, and focus on what matters.

I also wanted the app to work offline and keep everything local. Your tasks should be available without needing an account, backend, or internet connection.

The visual design is intentionally calm and minimal, with subtle details inspired by things I enjoy — **physics, engineering, and motorsport** — without letting those elements distract from the actual purpose of the app.

---

## How to Use FocusGrid

### 1. Add a task

Click **+ Add Task**, or press:

```text
N
```

Type what you need to do and press:

```text
Enter
```

The task will appear in the selected quadrant.

### 2. Choose the right quadrant

Use the four quadrants to decide what deserves your attention:

| Quadrant | What to do |
| --- | --- |
| **Urgent & Important** | Do it now |
| **Important & Not Urgent** | Plan it |
| **Urgent & Not Important** | Handle it quickly |
| **Not Urgent & Not Important** | Let it go |

The goal is not to fill every quadrant.

The goal is to make it easier to see **what matters now**.

### 3. Manage your tasks

Each task can be:

- Completed
- Edited
- Moved to another quadrant
- Deleted
- Sent to **Focus**

Completed tasks stay visible in their quadrant and move to the bottom instead of disappearing immediately.

### 4. Focus on one thing

When everything feels overwhelming, choose **Focus** on a task.

FocusGrid puts that task front and center and removes the rest of the matrix from view.

> **One thing at a time.**

Press `Esc` to leave Focus mode.

### 5. Your tasks are saved automatically

Tasks are stored locally in your browser using `localStorage`.

There is:

- No account
- No backend
- No database
- No cloud sync
- No required internet connection

Your task data stays on your device.

### 6. Use keyboard shortcuts

| Key | Action |
| --- | --- |
| `N` | Add a task |
| `Enter` | Save the task in the modal |
| `Esc` | Close the modal or leave Focus |
| `Tab` | Move through the interface |
| `Space` | Toggle the checkbox under the cursor |

Focus is trapped inside dialogs so keyboard navigation does not accidentally move behind an open modal.

### 7. Use it offline

FocusGrid is a **Progressive Web App (PWA)**.

The production build uses a service worker to cache the application files. After the app has loaded successfully once, it can be opened again without an internet connection.

You can also install it as a desktop app.

---

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
```

Production build and preview (this is the one with the service worker):

```bash
npm run build
npm run preview    # http://localhost:4173
```

Requires Node 18+. There is no config to fill in and nothing to sign into.

---

## Install it as a desktop app (Windows, Chrome or Edge)

The service worker only runs in a production build, so `npm run dev` will not offer installation. Use the preview server.

1. In the project folder, run:

   ```bash
   npm run build
   npm run preview
   ```

   Leave that terminal window open. It prints a local address, normally `http://localhost:4173/`.

2. Open that address in Chrome or Edge and let the page finish loading once. This first load is what fills the offline cache.

3. Install it:

   - **Chrome** — click the install icon at the right end of the address bar, then **Install**. If you do not see it, use the three-dot menu → **Cast, save, and share** → **Install page as app**.
   - **Edge** — three-dot menu → **Apps** → **Install this site as an app** → **Install**.

4. FocusGrid now appears in the Start menu and can be pinned to the taskbar. It opens in its own window with no browser chrome.

### Confirming it really works offline

1. With the app installed, stop the preview server (`Ctrl+C` in that terminal) or turn off your network adapter.
2. Open FocusGrid from the Start menu.
3. It should load normally, show the tasks you already had, and let you add, edit, complete, and delete tasks.

Nothing is fetched from the internet at any point: fonts are system fonts, and there are no API calls. The only files involved are the ones Workbox precached on that first load.

In Chrome or Edge DevTools you can see this directly under **Application → Service Workers** (status *activated and is running*) and **Application → Cache storage** (a `workbox-precache` entry holding the HTML, JS, CSS, manifest and icons).

> Note on the preview server: because the app was installed from `localhost:4173`, that address is its home. When the server is not running, the installed app is served entirely from the service-worker cache, which is exactly what the test above proves. If you want it permanently independent of a terminal, copy `dist/` to any static host, or keep `npm run preview` available; the offline behaviour is identical.

---

## Project structure

```text
focusgrid/
├── index.html                  app shell, zero external resources
├── public/
│   ├── manifest.webmanifest    PWA manifest (hand-written, not generated)
│   ├── favicon.svg
│   └── icon-192/512/maskable   atom mark, generated PNGs
├── src/
│   ├── main.tsx                React root
│   ├── App.tsx                 all app state + keyboard shortcuts
│   ├── types.ts                Task, QuadrantId, QuadrantMeta
│   ├── quadrants.ts            the four quadrants: title, instruction, icon, colour
│   ├── styles.css              one stylesheet, tokens first
│   ├── lib/
│   │   └── storage.ts          localStorage with validation + memory fallback
│   └── components/
│       ├── Matrix.tsx          2×2 grid + axis labels
│       ├── Quadrant.tsx        one card: header, count, list, empty state
│       ├── TaskCard.tsx        one row: checkbox, title, hover actions
│       ├── AddTaskModal.tsx    add *and* edit (title + quadrant + delete)
│       ├── FocusView.tsx       one task, centred, everything else gone
│       └── Icon.tsx            inline SVG set, atom mark, trajectory line
├── vite.config.ts              React plugin + vite-plugin-pwa
└── tsconfig*.json
```

## Architecture

All state lives in `App.tsx` as three `useState` values: the task list, which dialog is open, and which task is in focus. Everything below is a presentational component that receives props. No context, no reducer, no state library — the whole app is four verbs (add, edit, toggle, delete) over one array.

`quadrants.ts` is the single source of truth for the four quadrants. Adding or renaming one is a one-file change; the matrix, the chips in the modal, and the colour tokens all read from it.

The modal is deliberately one component for both adding and editing. Editing a task and moving it between quadrants are the same interaction, so they are the same screen.

## Offline persistence

`src/lib/storage.ts` writes the whole task array to `localStorage` under `focusgrid.tasks.v1` on every change, via a `useEffect` in `App.tsx`.

On load, every entry is validated: an object needs a string `id`, a string `title`, and a `quadrant` that is one of the four known ids. Entries that fail are dropped, and if the stored value is not valid JSON or not an array, the key is cleared and the app starts empty instead of crashing. If `localStorage` is missing or a write fails (private mode, quota, disabled storage), the module flips to an in-memory store and the app tells you that tasks will only last for the session.

Offline itself is handled by `vite-plugin-pwa` in `generateSW` mode: the built shell (HTML, JS, CSS, icons, manifest) is precached by Workbox with `navigateFallback: "index.html"`, so after one successful load the app opens with no network. There are no API calls to fail — task data never leaves the device.

## Keyboard

| Key | Action |
| --- | --- |
| `N` | Add a task |
| `Enter` | Save the task in the modal |
| `Esc` | Close the modal or leave Focus |
| `Tab` | Move through the grid; focus is trapped inside dialogs |
| `Space` | Toggle the checkbox under the cursor |

## Design notes

Type is a system stack — Segoe UI Variable Text on Windows, San Francisco on macOS, whatever the distro ships on Linux. No webfont is downloaded, so the first offline launch looks exactly like the first online one.

Palette, as specified:

```text
#F4F3EF  background
#2F3E46  text
#E29587  Q1
#9DB2A3  Q2
#8EA4B4  Q3
#C2B6C3  Q4
```

Dark mode reuses the same hues at low chroma over `#191F22` — dim, not black, and never neon.

Each quadrant carries an icon (bolt, leaf, clock, star) and a one-line instruction, so colour is never the only signal. Task rows are rows, not nested cards: a circle, a title, and actions that appear on hover — and stay visible on touch devices, where there is no hover.

The physics and motorsport references are two objects only: the three-orbit atom mark, and a single hairline trajectory — long straight, one apex, exit — that appears in empty quadrants and along the bottom of the Focus view. Nothing else.

## Accessibility & interaction

FocusGrid is designed around simple, predictable interactions.

- Visible keyboard focus states
- Keyboard navigation
- Focus trapping inside dialogs
- `Esc` to close dialogs and leave Focus mode
- Reduced-motion support
- Icons paired with text
- Colour is not the only indicator of quadrant meaning
- Long task titles wrap naturally instead of being cut off mid-word

The goal is to make the interface easy to understand without requiring users to learn a complicated productivity system.

## Assumptions

- `dueDate` exists in the data model but has no UI. Every optional field is friction, and you marked it optional.
- Completed tasks stay in their quadrant and sort to the bottom rather than disappearing, so finishing something is visible.
- The theme follows your system until you press the toggle, after which the choice is remembered in `focusgrid.theme`.
- The app makes zero network requests of any kind. No fonts, no analytics, no APIs — the entire thing is the files in this folder.
- Long task titles wrap to two lines and then truncate, rather than being cut off mid-word on one line.
- No tests are included. At this size, the checklist in this README run by hand is a better use of your time than a test harness to maintain.

## Privacy

FocusGrid is local-only by design.

There is no user account, backend, analytics service, or cloud database.

Task data is stored locally in the browser and does not need to leave the device for the application to function.

## License

This project is available for personal and educational use.

---

## Tags

#FocusGrid #Productivity #EisenhowerMatrix #TaskManagement #OfflineFirst #PWA #ProgressiveWebApp #React #TypeScript #Vite #LocalStorage #FrontendDevelopment #WebDevelopment #ADHDFriendly #MinimalistDesign #OpenSource
