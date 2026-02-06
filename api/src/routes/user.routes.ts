import { FastifyTypedInstance } from "../types/zod";
import { createuUserSchema } from "../schemas/user.schema";
import {
  deleteUserHandler,
  fetchAuthenticatedUserHandler,
  listUsersHandler,
  registerUserHandler,
} from "../controllers/user.controller";
import z from "zod";

export async function userRoutes(app: FastifyTypedInstance) {
  app.get(
    "/",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["users"],
        description: "List users",
        response: {
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    listUsersHandler,
  );

  app.get(
    "/me",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["users"],
        description: "Fetch authenticated user",
        response: {
          404: z.object({ message: z.string() }).describe("User not found"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    fetchAuthenticatedUserHandler,
  );

  app.post(
    "/",
    {
      //preHandler: app.authenticate,
      schema: {
        tags: ["users"],
        description: "Create a new user",
        body: createuUserSchema,
        response: {
          400: z.object({ message: z.string() }).describe("Bad request"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    registerUserHandler,
  );

  app.delete(
    "/:id",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["users"],
        description: "Delete user",
        response: {
          400: z.object({ message: z.string() }).describe("Bad request"),
          404: z.object({ message: z.string() }).describe("Not found"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    deleteUserHandler,
  );
}
