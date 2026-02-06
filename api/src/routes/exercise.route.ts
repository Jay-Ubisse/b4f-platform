import z from "zod";
import { FastifyTypedInstance } from "../types/zod";
import {
  checkExerciseAnswerHandler,
  createExerciseHandler,
  deleteExerciseHandler,
  fetchExerciseHandler,
  fetchExercisesHandler,
  updateExerciseHandler,
} from "../controllers/exercise.controller";
import {
  checkExerciseAnswerSchema,
  exerciseSchema,
} from "../schemas/exercise.schema";

const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  password: z.string(), // está vindo na resposta
  avatarUrl: z.string().nullable(),
  role: z.enum(["ADMIN", "TEACHER", "STUDENT", "ALUMNI"]),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const chapterSchema = z.object({
  id: z.string(),
  name: z.string(),
  bannerUrl: z.string().nullable(),
  videoUrl: z.string().nullable(),
  content: z.string(),
  createdById: z.string(),
  moduleId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export async function exerciseRoutes(app: FastifyTypedInstance) {
  app.get(
    "/",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["exercises"],
        description: "Fetch all exercises",
        response: {
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    fetchExercisesHandler
  );

  app.get(
    "/:id",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["exercises"],
        description: "Fetch exercise by ID",
        response: {
          400: z.object({ message: z.string() }).describe("Bad request"),
          404: z.object({ message: z.string() }).describe("Not found"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    fetchExerciseHandler
  );

  app.put(
    "/:id",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["exercises"],
        description: "Update exercise",
        body: exerciseSchema.partial(),
        response: {
          400: z.object({ message: z.string() }).describe("Bad request"),
          404: z.object({ message: z.string() }).describe("Not found"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    updateExerciseHandler
  );

  app.delete(
    "/:id",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["exercises"],
        description: "Delete exercise",
        response: {
          200: z
            .object({
              message: z.string(),
            })
            .describe("Exercise deleted successfully"),
          400: z.object({ message: z.string() }).describe("Bad request"),
          404: z.object({ message: z.string() }).describe("Not found"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    deleteExerciseHandler
  );

  app.post(
    "/",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["exercises"],
        description: "Create exercise",
        body: exerciseSchema,
        response: {
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    createExerciseHandler
  );

  app.post(
    "/check-answer",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["exercises"],
        description: "Check exercise answer",
        body: checkExerciseAnswerSchema,
        response: {
          200: z
            .object({
              message: z.string(),
            })
            .describe("Correct answer"),
          400: z.object({ message: z.string() }).describe("Bad request"),
          404: z.object({ message: z.string() }).describe("Not found"),
          422: z.object({ message: z.string() }).describe("Wrong answer"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    checkExerciseAnswerHandler
  );
}
