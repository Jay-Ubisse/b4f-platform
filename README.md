## B4F Platform (Monorepo)

This repository contains the **B4F Platform**: a full‑stack system composed of:

- a **backend API** (Fastify + Prisma)
- a **public applications portal + admin dashboard** (Next.js)
- an **e‑learning platform** (Next.js)

---

### Packages

- **`api/`**  
  Backend service (Fastify 5 + Prisma + TypeScript).  
  Start here if you want the API running locally.

- **`applications-frontend/`**  
  Next.js app for the **public candidate application flow** and the **private back‑office dashboard** (candidates, classes, courses, editions, interviews, users, etc.).

- **`elearning-frontend/`**  
  Next.js app for the **PU e‑Learn Platform** (courses, modules, chapters, exercises, quizzes, students, calendar).

Each package has its own `README.md` with details.

---

### Prerequisites

- Node.js 20+ (LTS recommended)
- npm / pnpm / yarn (examples use **npm**)
- A database supported by Prisma (commonly PostgreSQL) for `api/`

---

### Quick Start (Local Development)

#### 1) Start the API

```bash
cd api
npm install
# configure api/.env (DATABASE_URL, JWT secret, etc.)
npx prisma migrate dev
npm run dev
```

#### 2) Start the applications frontend

```bash
cd applications-frontend
npm install
# configure env vars if required (.env.local)
npm run dev
```

#### 3) Start the e‑learning frontend

```bash
cd elearning-frontend
npm install
# configure env vars if required (.env.local)
npm run dev
```

---

### Environment Variables

This monorepo does not enforce a single shared `.env`. Each package typically uses its own:

- `api/.env`
- `applications-frontend/.env.local`
- `elearning-frontend/.env.local`

Search for environment usage in each package (e.g. `services/*`, `lib/*`, `src/*`) and consult the package README for hints.

---

### Notes

- This repo currently contains some built artifacts and installed dependencies (e.g. `node_modules/`). The root `.gitignore` added in this repository is meant to prevent committing those files.
- If you later convert this folder into a git repository, run `git init` at the root and commit only source/config files.

