import z from "zod";
import { FastifyTypedInstance } from "../types/zod";
import {
  checkQuizzItemAnswer,
  createQuizzItemHandler,
  deleteQuizzItemHandler,
  fetchQuizzItemHandler,
  fetchQuizzItemsHandler,
  updateQuizzItemHandler,
} from "../controllers/quizz-item.controller";
import {
  checkQuizzAnswerSchema,
  quizzItemSchema,
} from "../schemas/quizz.schema";

export const quizzSchema = z.object({
  id: z.string(),
  name: z.string(),
  chapterId: z.string(),
  createdById: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export async function quizzItemsRoutes(app: FastifyTypedInstance) {
  app.get(
    "/quizz/:quizzId",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["quizz items"],
        description: "Fetch quizz items by quizz",
        response: {
          200: z
            .object({
              message: z.string(),
              quizzItems: z.array(
                z.object({
                  id: z.string(),
                  quizzId: z.string(),
                  question: z.string(),
                  option1: z.string(),
                  option2: z.string(),
                  option3: z.string().nullable(),
                  option4: z.string().nullable(),
                  answer: z.string(),
                  quizz: quizzSchema,
                  createdAt: z.coerce.date(),
                  updatedAt: z.coerce.date(),
                })
              ),
            })
            .describe("Quizz items fetched successfully"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    fetchQuizzItemsHandler
  );

  app.get(
    "/:id",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["quizz items"],
        description: "Fetch quizz item by ID",
        response: {
          200: z
            .object({
              message: z.string(),
              quizzItem: z.object({
                id: z.string(),
                quizzId: z.string(),
                question: z.string(),
                option1: z.string(),
                option2: z.string(),
                option3: z.string().nullable(),
                option4: z.string().nullable(),
                answer: z.string(),
                quizz: quizzSchema,
                createdAt: z.coerce.date(),
                updatedAt: z.coerce.date(),
              }),
            })
            .describe("Quizz Item fetched successfully"),
          400: z.object({ message: z.string() }).describe("Bad request"),
          404: z.object({ message: z.string() }).describe("Not found"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    fetchQuizzItemHandler
  );

  app.post(
    "/",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["quizz items"],
        description: "Create quizz item",
        body: quizzItemSchema,
        response: {
          200: z
            .object({
              message: z.string(),
              quizzItem: z.object({
                id: z.string(),
                quizzId: z.string(),
                question: z.string(),
                option1: z.string(),
                option2: z.string(),
                option3: z.string().nullable(),
                option4: z.string().nullable(),
                answer: z.string(),
                createdAt: z.coerce.date(),
                updatedAt: z.coerce.date(),
              }),
            })
            .describe("Quizz item created successfully"),
          400: z.object({ message: z.string() }).describe("Bad request"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    createQuizzItemHandler
  );

  app.put(
    "/:id",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["quizz items"],
        description: "Update quizz item",
        body: quizzItemSchema.partial(),
        response: {
          200: z
            .object({
              message: z.string(),
              quizzItem: z.object({
                id: z.string(),
                quizzId: z.string(),
                question: z.string(),
                option1: z.string(),
                option2: z.string(),
                option3: z.string().nullable(),
                option4: z.string().nullable(),
                answer: z.string(),
                createdAt: z.coerce.date(),
                updatedAt: z.coerce.date(),
              }),
            })
            .describe("Quizz item updated successfully"),
          400: z.object({ message: z.string() }).describe("Bad request"),
          404: z.object({ message: z.string() }).describe("Not found"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    updateQuizzItemHandler
  );

  app.delete(
    "/:id",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["quizz items"],
        description: "Delete quizz item",
        response: {
          200: z
            .object({
              message: z.string(),
            })
            .describe("Quizz item deleted successfully"),
          400: z.object({ message: z.string() }).describe("Bad request"),
          404: z.object({ message: z.string() }).describe("Not found"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    deleteQuizzItemHandler
  );

  app.post(
    "/check-answer",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["quizz items"],
        description: "Check quizz item answer",
        body: checkQuizzAnswerSchema,
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
    checkQuizzItemAnswer
  );
}
