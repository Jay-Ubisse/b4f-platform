## B4F Platform API (PU Learn Platform API)

This package is the **backend API** for the B4F / PU e‑Learn platform.

It is a **Fastify + Prisma + TypeScript** service that exposes REST APIs for:

- Authentication and authorization (JWT + cookies)
- Managing users, students, courses, modules, chapters, exercises, quizzes, attendance, and more
- Integrations such as email (Resend) and SMS (Twilio)

It is consumed by:

- `applications-b4f-client` – applications dashboard/frontend
- `elearning-b4f-client` – PU e‑Learn Platform frontend

---

### Tech Stack

- **Runtime**: Node.js (TypeScript with `tsx`)
- **Framework**: Fastify 5
- **ORM**: Prisma (`@prisma/client`, `prisma`)
- **Validation / typing**: `zod`, `fastify-type-provider-zod`
- **Auth**:
  - `@fastify/jwt`
  - `@fastify/cookie`
  - `jsonwebtoken`
- **API docs**:
  - `@fastify/swagger`
  - `@fastify/swagger-ui`
- **Other**:
  - `date-fns`
  - `resend` for transactional emails
  - `twilio` for SMS
  - `vm2` for sandboxed code execution (e.g. coding exercises)

---

### Project Structure (typical)

> Exact paths may vary slightly; consult `src/` for the authoritative list.

- `src/server.ts` – Fastify server entrypoint (registered plugins, routes, Swagger).
- `src/**` – route handlers, services, schemas, and utilities.
- `prisma/schema.prisma` – database schema.
- `prisma/migrations/` – versioned DB migrations.

---

### Scripts

From `package.json`:

- **`npm run dev`**  
  Runs the server in watch mode:

  ```bash
  tsx watch src/server.ts
  ```

- **`npm run build`**  
  Generates Prisma client and compiles TypeScript:

  ```bash
  prisma generate && tsc
  ```

- **`npm start`**  
  Starts the server:

  ```bash
  tsx src/server.ts
  ```

- **`npm run postinstall`**  
  Generates Prisma client (`prisma generate`).

---

### Getting Started

#### Prerequisites

- Node.js 20+ (LTS recommended)
- A relational database supported by Prisma (e.g. PostgreSQL)
- Package manager: npm / pnpm / yarn (examples use **npm**)

#### Installation

From the monorepo root:

```bash
cd b4f-platform-api
npm install
```

#### Environment Variables

Create a `.env` file based on your needs. Common variables include (names may vary in your codebase):

- **`DATABASE_URL`** – connection string for your database.
- **`JWT_SECRET`** – secret used by `@fastify/jwt` / `jsonwebtoken`.
- **`PORT`** – port on which Fastify should listen (default often `3333` or `3000`).
- **`RESEND_API_KEY`** – for email sending.
- **`TWILIO_ACCOUNT_SID`**, **`TWILIO_AUTH_TOKEN`**, **`TWILIO_FROM_NUMBER`** – for SMS.
- Any additional config keys referenced in your `src` files.

Check `src/server.ts` and other config modules for the precise list.

#### Database setup

1. Ensure `DATABASE_URL` is configured.
2. Run Prisma migrations:

```bash
npx prisma migrate dev
```

3. (Optional) Seed the database if a seeder script exists.

---

### Running the Server

#### Development

```bash
npm run dev
```

The API will start in watch mode; check your terminal output for the URL (for example `http://localhost:3333`).

#### Production

1. Build:

   ```bash
   npm run build
   ```

2. Start the compiled server (or continue using `tsx` depending on your deployment strategy):

   ```bash
   npm start
   ```

---

### API Documentation

The project uses **Fastify Swagger** and **Swagger UI**. Once the server is running, you can typically access:

- **OpenAPI JSON** route (e.g. `/docs/json` or `/documentation/json`)
- **Swagger UI** route (e.g. `/docs` or `/documentation`)

Check `src/server.ts` for the exact paths in your configuration.

---

### Related Frontends

- **Applications client**: `applications-b4f-client`
- **E‑learning client**: `elearning-b4f-client`

These frontends should be configured to point to this API’s base URL (e.g. via `NEXT_PUBLIC_API_BASE_URL` or similar environment variables).

