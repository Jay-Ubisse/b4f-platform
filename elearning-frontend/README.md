## PU e‑Learn Platform Client

This package is the **student and instructor-facing e‑learning frontend** of the B4F platform, branded as the **PU e‑Learn Platform**.

It provides:

- **Course and module navigation**
- **Chapters and rich‑text content**
- **Exercises (including JavaScript coding exercises)**
- **Quizzes and quiz management**
- **Student management and attendance**
- **Calendar and overview of learning activities**

Built with **Next.js 15**, **React 19**, **TypeScript**, **Tailwind CSS 4**, **Tiptap** editor, and **TanStack Query**.

---

### Features

- **Authenticated private area** under `app/(pages)/(private)/...`:
  - `overview` – learning overview.
  - `courses`, `modules`, `chapters` – course structure.
  - `exercises` – generic and JavaScript‑specific exercises (with code editor).
  - `quizzes` and `quizzes-management` – quiz solving and management.
  - `students` – list and management of students.
  - `calendar` – schedule and attendance‑related views.
- **Rich text and code editing** using **Tiptap** and **Monaco Editor**.
- **Dark/light theme** toggle using `next-themes`.
- **Responsive UI** using Tailwind + Radix UI components.

---

### Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **UI**:
  - Tailwind CSS 4
  - Radix UI (`@radix-ui/react-*`)
  - `lucide-react` icons
  - Custom `ui/` components generated via `components.json`
- **Editor / content**:
  - `@tiptap/*` ecosystem for rich‑text editing
  - `@monaco-editor/react` for code editing
  - `highlight.js` and `lowlight` for syntax highlighting
- **State / data**:
  - `@tanstack/react-query`
  - `@tanstack/react-table`
  - `react-hook-form` + `zod`
- **Backend access**:
  - `axios`
  - `@supabase/supabase-js` (where configured)
- **Other**:
  - `date-fns`
  - `js-cookie`
  - `react-hot-toast`, `canvas-confetti`, etc.

---

### Getting Started

#### Prerequisites

- Node.js 20+ (LTS recommended)
- pnpm / npm / yarn (examples below use **npm**)
- Running instance of the backend (`b4f-platform-api` or equivalent) and DB

#### Installation

From the monorepo root:

```bash
cd elearning-b4f-client
npm install
```

#### Development

```bash
npm run dev
```

This starts `next dev --turbopack` and serves the app (commonly on `http://localhost:3001` or another available port; check terminal output).

#### Production build

```bash
npm run build
```

To run the production server:

```bash
npm start
```

---

### Available Scripts

From `package.json`:

- **`npm run dev`**: Start Next.js dev server with Turbopack.
- **`npm run build`**: Build the Next.js app for production.
- **`npm start`**: Start the production server.
- **`npm run lint`**: Run ESLint (`next lint`).

---

### Project Structure (simplified)

- `app/layout.tsx` – root layout.
- `app/(pages)/(public)` – public/auth routes (e.g. sign‑in).
- `app/(pages)/(private)/overview/page.tsx` – main overview page.
- `app/(pages)/(private)/courses/*` – course list and detail.
- `app/(pages)/(private)/modules/*` – modules pages.
- `app/(pages)/(private)/chapters/*` – chapter pages and editor CSS.
- `app/(pages)/(private)/exercises/*` – exercises and JS exercises.
- `app/(pages)/(private)/quizzes/*` – quiz‑taking flows.
- `app/(pages)/(private)/quizzes-management/*` – quiz management tools.
- `app/(pages)/(private)/students/page.tsx` – student management list.
- `components/` – shared UI components (sidebar, tables, dialogs, forms, etc.).
- `contexts/` – React contexts (auth, edition selection).
- `hooks/` – reusable hooks (cursor visibility, menu navigation, tiptap, etc.).
- `lib/` – util modules (axios instance, Supabase client, tiptap utils, text generators, etc.).
- `services/` – API client modules for attendance, auth, calendar, chapter, course, edition, exercise, module, quiz, student, user.

---

### Environment Variables

Environment variables are usually defined in `.env.local`. Common examples (exact names may vary):

- **`NEXT_PUBLIC_API_BASE_URL`** – base URL for the backend API.
- **`NEXT_PUBLIC_SUPABASE_URL`** / **`NEXT_PUBLIC_SUPABASE_ANON_KEY`** – Supabase configuration if used.
- **Auth / JWT settings** used by the backend.

Inspect `lib/axios.ts`, `lib/supabase-client.ts`, and `services/*` for the definitive list used by this app.

---

### Deployment

1. Build with `npm run build`.
2. Ensure all environment variables are configured on your hosting provider.
3. Run `npm start` (or the platform‑specific start command).

This app is suitable for deployment to platforms like **Vercel**, **Netlify**, or a custom Node/Docker environment.

---

### Related Projects in this Monorepo

- `applications-b4f-client` – public application & back‑office dashboard for B4F.
- `b4f-platform-api` – Fastify + Prisma backend used by this client.

