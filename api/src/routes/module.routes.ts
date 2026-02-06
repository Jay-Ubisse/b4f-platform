import z from "zod";
import {
  createModuleHanlder,
  deleteModuleHandler,
  fetchModuleHandler,
  fetchModulesHandler,
  updateModuleHanlder,
} from "../controllers/module.controller";
import { FastifyTypedInstance } from "../types/zod";

export async function moduleRoutes(app: FastifyTypedInstance) {
  app.get(
    "/",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["modules"],
        description: "Fetch all modules",
        response: {
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    fetchModulesHandler
  );

  app.get(
    "/:moduleId",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["modules"],
        description: "Fetch module by ID",
        response: {
          400: z.object({ message: z.string() }).describe("Bad request"),
          404: z.object({ message: z.string() }).describe("Not found"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    fetchModuleHandler
  );

  app.post(
    "/",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["modules"],
        description: "Create module",
        response: {
          200: z
            .object({
              message: z.string(),
              module: z.object({
                id: z.string(),
                name: z.string(),
                courseId: z.string(),
                bannerUrl: z.string().optional(),
                createdById: z.string(),
                createdAt: z.coerce.date(),
                updatedAt: z.coerce.date(),
              }),
            })
            .describe("Create module"),
          400: z.object({ message: z.string() }).describe("Bad request"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    createModuleHanlder
  );

  app.put(
    "/:moduleId",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["modules"],
        description: "Update module",
        response: {
          200: z
            .object({
              message: z.string(),
              module: z.object({
                id: z.string(),
                name: z.string(),
                courseId: z.string(),
                bannerUrl: z.string().optional(),
                createdById: z.string(),
                createdAt: z.coerce.date(),
                updatedAt: z.coerce.date(),
              }),
            })
            .describe("Update module"),
          400: z.object({ message: z.string() }).describe("Bad request"),
          404: z.object({ message: z.string() }).describe("Not found"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    updateModuleHanlder
  );

  app.delete(
    "/:moduleId",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["modules"],
        description: "Delete module",
        response: {
          200: z
            .object({
              message: z.string(),
              module: z.object({
                id: z.string(),
                name: z.string(),
                tags: z.string().optional(),
                bannerUrl: z.string().optional(),
                createdById: z.string(),
                createdAt: z.coerce.date(),
                updatedAt: z.coerce.date(),
              }),
            })
            .describe("Delete module"),
          400: z.object({ message: z.string() }).describe("Bad request"),
          404: z.object({ message: z.string() }).describe("Not found"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    deleteModuleHandler
  );
}
