import z from "zod";
import {
  createQuizzHandler,
  deleteQuizzHandler,
  fetchQuizzHandler,
  fetchQuizzesHandler,
  updateQuizzHandler,
} from "../controllers/quizz.controller";
import { FastifyTypedInstance } from "../types/zod";
import { quizzSchema } from "../schemas/quizz.schema";

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

export const quizzItemsSchema = z.object({
  id: z.string(),
  question: z.string(),
  option1: z.string(),
  option2: z.string(),
  option3: z.string().nullable(),
  option4: z.string().nullable(),
  answer: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export async function quizzRoutes(app: FastifyTypedInstance) {
  app.get(
    "/",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["quizzes"],
        description: "Fetch all quizzs",
        response: {
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    fetchQuizzesHandler
  );

  app.get(
    "/:id",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["quizzes"],
        description: "Fetch quizz by ID",
        response: {
          400: z.object({ message: z.string() }).describe("Bad request"),
          404: z.object({ message: z.string() }).describe("Not found"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    fetchQuizzHandler
  );

  app.post(
    "/",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["quizzes"],
        description: "Create quizz",
        body: quizzSchema,
        response: {
          200: z
            .object({
              message: z.string(),
              quizz: z.object({
                id: z.string(),
                name: z.string(),
                quizzId: z.string(),
                createdById: z.string(),
                createdAt: z.coerce.date(),
                updatedAt: z.coerce.date(),
              }),
            })
            .describe("Quizz created successfully"),
          400: z.object({ message: z.string() }).describe("Bad request"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    createQuizzHandler
  );

  app.put(
    "/:id",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["quizzes"],
        description: "Update quizz ",
        body: quizzSchema.partial(),
        response: {
          200: z
            .object({
              message: z.string(),
              quizz: z.object({
                id: z.string(),
                name: z.string(),
                chapterId: z.string(),
                createdById: z.string(),
                createdAt: z.coerce.date(),
                updatedAt: z.coerce.date(),
              }),
            })
            .describe("Quizz updated successfully"),
          400: z.object({ message: z.string() }).describe("Bad request"),
          404: z.object({ message: z.string() }).describe("Not found"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    updateQuizzHandler
  );

  app.delete(
    "/:id",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["quizzes"],
        description: "Delete quizz",
        response: {
          200: z
            .object({
              message: z.string(),
            })
            .describe("Quizz deleted successfully"),
          400: z.object({ message: z.string() }).describe("Bad request"),
          404: z.object({ message: z.string() }).describe("Not found"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    deleteQuizzHandler
  );
}
