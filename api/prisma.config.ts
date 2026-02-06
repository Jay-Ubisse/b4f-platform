import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Prisma ORM v7: connection URLs live in prisma.config.ts (not schema.prisma).
    // Prefer a direct connection for Migrate/Studio when available.
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "",
  },
});

