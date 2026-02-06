import { FastifyTypedInstance } from "../types/zod";
import z, { Schema } from "zod";
import {
  createEditionSchema,
  updateEditionSchema,
} from "../schemas/edition.schema";
import {
  createEditionHandler,
  deleteEditionHandler,
  fetchEditionsHandler,
  updateEditionHandler,
  updateEditionInterviewBookingUrlHandler,
} from "../controllers/edition.controller";

export async function editionRoutes(app: FastifyTypedInstance) {
  app.get(
    "/",
    {
      //preHandler: app.authenticate,
      schema: {
        tags: ["editions"],
        description: "Fetch all editions",
        response: {
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    fetchEditionsHandler,
  );

  app.post(
    "/",
    {
      //preHandler: app.authenticate,
      schema: {
        tags: ["editions"],
        description: "Create a new edition",
        body: createEditionSchema,
        response: {
          400: z.object({ message: z.string() }).describe("Bad request"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    createEditionHandler,
  );

  app.put(
    "/:id",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["editions"],
        description: "Create a new edition",
        body: updateEditionSchema,
        response: {
          400: z.object({ message: z.string() }).describe("Bad request"),
          404: z
            .object({
              message: z.string(),
            })
            .describe("Not found"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    updateEditionHandler,
  );

  app.put(
    "/:editionId/interview-booking",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["editions"],
        description: "Update edition interview booking URL",
        body: z.object({
          interviewBookingUrl: z.string().url(),
        }),
        response: {
          400: z.object({ message: z.string() }).describe("Bad request"),
          404: z
            .object({
              message: z.string(),
            })
            .describe("Not found"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    updateEditionInterviewBookingUrlHandler,
  );

  app.delete(
    "/:id",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["editions"],
        description: "Delete edition",
        response: {
          200: z
            .object({
              message: z.string(),
            })
            .describe("Edition deleted successfully"),
          400: z
            .object({
              message: z.string(),
            })
            .describe("Bad request"),
          404: z
            .object({
              message: z.string(),
            })
            .describe("Not found"),
          500: z
            .object({
              message: z.string(),
            })
            .describe("Internal server error"),
        },
      },
    },
    deleteEditionHandler,
  );
}
