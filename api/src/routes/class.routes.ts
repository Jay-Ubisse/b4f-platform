import z from "zod";
import { FastifyTypedInstance } from "../types/zod";
import {
  createClassHandler,
  deleteClassHandler,
  fecthClassHandler,
  fecthClassesHandler,
  fetchClassesByEditionHandler,
} from "../controllers/class.controller";
import { classSchema } from "../schemas/class.schema";

export function classRoutes(app: FastifyTypedInstance) {
  app.get(
    "/edition/:editionId",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["classes"],
        description: "Fetch classes by edition",
        response: {
          404: z.object({ message: z.string() }).describe("Not found"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    fetchClassesByEditionHandler
  );

  app.get(
    "/",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["classes"],
        description: "Fetch all classes",
        response: {
          404: z.object({ message: z.string() }).describe("Not found"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    fecthClassesHandler
  );

  app.get(
    "/:id",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["classes"],
        description: "Fetch class by Id",
        response: {
          404: z.object({ message: z.string() }).describe("Not found"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    fecthClassHandler
  );

  app.post(
    "/",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["classes"],
        description: "Create class",
        body: classSchema,
        response: {
          201: z
            .object({
              message: z.string(),
              class_: z.object({
                id: z.string(),
                capacity: z.number(),
                shift: z.enum(["MORNING", "AFTERNOON"]),
              }),
            })
            .describe("Class created successfully"),
          400: z.object({ message: z.string() }).describe("Bad request"),
          404: z.object({ message: z.string() }).describe("Not found"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    createClassHandler
  );

  app.delete(
    "/:id",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["classes"],
        description: "Delete class",
        response: {
          400: z.object({ message: z.string() }).describe("Bad request"),
          404: z.object({ message: z.string() }).describe("Not found"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    deleteClassHandler
  );
}
