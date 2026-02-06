## Applications B4F Client

This package is the **public application portal and back‑office dashboard** for the B4F platform.

- **Public area**: landing page, candidate application form, and application status lookup.
- **Private area**: authenticated dashboard for managing candidates, classes, countries, courses, editions, interviews, and users.

Built with **Next.js 15**, **React 19**, **TypeScript**, **Tailwind CSS**, **next-intl**, and **NextAuth**.

---

### Features

- **Multilingual public site** using `next-intl` and `[locale]` routing.
- **Candidate application flow** (`/application`) with rich forms and validation.
- **Application status search** (`/search-candidate`).
- **Admin dashboard** under `(pages)/(private)/dashboard`:
  - Candidates, classes, courses, countries, interviews, editions, and users management.
  - Data tables powered by **TanStack Query** and **TanStack Table**.
- **Auth & sessions** via **NextAuth**.
- **Responsive UI** using Tailwind CSS and Radix UI primitives.

---

### Tech Stack

- **Framework**: Next.js 15 (App Router, `app/[locale]/(pages)/...`)
- **Language**: TypeScript
- **UI**:
  - Tailwind CSS 4
  - Radix UI (`@radix-ui/*`)
  - `lucide-react` icons
- **Data / state**:
  - `@tanstack/react-query`
  - `@tanstack/react-table`
  - `react-hook-form` + `zod`
- **Auth**: `next-auth`
- **Backend access**: `axios`, `@supabase/supabase-js` (where applicable)
- **Other**: `date-fns`, `bcrypt`, `resend`, `twilio`

---

### Getting Started

#### Prerequisites

- Node.js 20+ (LTS recommended)
- pnpm / npm / yarn (examples below use **npm**)
- Access to the corresponding API and database (see `b4f-platform-api`)

#### Installation

From the monorepo root:

```bash
cd applications-b4f-client
npm install
```

#### Running in development

```bash
npm run dev
```

By default this runs `next dev --turbopack` and serves the app (for example on `http://localhost:3000` – see terminal output for the exact port).

#### Building for production

```bash
npm run build
```

This will:

- Run `prisma generate`
- Build the Next.js application

To start the built app:

```bash
npm start
```

---

### Available Scripts

Defined in `package.json`:

- **`npm run dev`**: Start the Next.js dev server with Turbopack.
- **`npm run build`**: Generate Prisma client and build the Next.js app.
- **`npm run postinstall`**: Generate Prisma client.
- **`npm start`**: Start the production server.
- **`npm run lint`**: Run ESLint via `next lint`.

---

### Project Structure (simplified)

- `app/[locale]/(pages)/(public)/page.tsx` – public landing page.
- `app/[locale]/(pages)/(public)/application/page.tsx` – candidate application form.
- `app/[locale]/(pages)/(public)/search-candidate/page.tsx` – application status search.
- `app/[locale]/(pages)/(public)/sign-in/page.tsx` – sign‑in.
- `app/[locale]/(pages)/(private)/dashboard/...` – authenticated dashboard (candidates, classes, etc.).
- `components/` – UI components and form building blocks.
- `services/` – API client functions (auth, candidates, classes, courses, editions, interviews, users, etc.).
- `contexts/`, `hooks/`, `lib/`, `providers/` – shared logic and configuration.

---

### Environment Variables

Environment variables are typically defined in `.env` / `.env.local`. Common variables you may need (names may vary depending on your setup):

- **`NEXTAUTH_URL`** – public base URL of this app.
- **`NEXTAUTH_SECRET`** – secret key for NextAuth.
- **`DATABASE_URL` / API URLs** – connection to the backend (`b4f-platform-api` or other services).
- **Provider keys** for email/SMS (Resend, Twilio) if used from this app.

Check the `.env.example` (if present) or `services/*` and auth configuration files for the authoritative list.

---

### Deployment

1. Build the app using `npm run build`.
2. Ensure environment variables are correctly set in your hosting platform (Vercel, Render, Docker, etc.).
3. Run `npm start` (or the host‑specific start command).

For serverless platforms like Vercel you can connect the repo directly and rely on the default Next.js build pipeline.

---

### Related Projects in this Monorepo

- `elearning-b4f-client` – PU e‑Learn Platform frontend.
- `b4f-platform-api` – shared Fastify + Prisma backend for authentication and data.

