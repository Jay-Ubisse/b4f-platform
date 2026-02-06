import z from "zod";
import {
  createChapterHanlder,
  deleteChapterHandler,
  fetchChapterHandler,
  fetchChaptersHandler,
  updateChapterHanlder,
} from "../controllers/chapter.controller";
import { FastifyTypedInstance } from "../types/zod";

export async function chapterRoutes(app: FastifyTypedInstance) {
  app.get(
    "/",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["chapters"],
        description: "Fetch all chapters",
        response: {
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    fetchChaptersHandler
  );

  app.get(
    "/:chapterId",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["chapters"],
        description: "Fetch chapter by ID",
        response: {
          400: z.object({ message: z.string() }).describe("Bad request"),
          404: z.object({ message: z.string() }).describe("Not found"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    fetchChapterHandler
  );

  app.post(
    "/",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["chapters"],
        description: "Create chapter",
        response: {
          200: z
            .object({
              message: z.string(),
              chapter: z.object({
                id: z.string(),
                name: z.string(),
                moduleId: z.string(),
                bannerUrl: z.string().optional(),
                videoUrl: z.string().optional(),
                content: z.string(),
                createdById: z.string(),
                createdAt: z.coerce.date(),
                updatedAt: z.coerce.date(),
              }),
            })
            .describe("Create chapter"),
          400: z.object({ message: z.string() }).describe("Bad request"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    createChapterHanlder
  );

  app.put(
    "/:chapterId",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["chapters"],
        description: "Update chapter",
        response: {
          200: z
            .object({
              message: z.string(),
              chapter: z.object({
                id: z.string(),
                name: z.string(),
                moduleId: z.string(),
                bannerUrl: z.string().optional(),
                videoUrl: z.string().optional(),
                content: z.string(),
                createdById: z.string(),
                createdAt: z.coerce.date(),
                updatedAt: z.coerce.date(),
              }),
            })
            .describe("Update chapter"),
          400: z.object({ message: z.string() }).describe("Bad request"),
          404: z.object({ message: z.string() }).describe("Not found"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    updateChapterHanlder
  );

  app.delete(
    "/:chapterId",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["chapters"],
        description: "Delete chapter",
        response: {
          200: z
            .object({
              message: z.string(),
              chapter: z.object({
                id: z.string(),
                name: z.string(),
                moduleId: z.string(),
                bannerUrl: z.string().optional(),
                videoUrl: z.string().optional(),
                content: z.string(),
                createdById: z.string(),
                createdAt: z.coerce.date(),
                updatedAt: z.coerce.date(),
              }),
            })
            .describe("Delete chapter"),
          400: z.object({ message: z.string() }).describe("Bad request"),
          404: z.object({ message: z.string() }).describe("Not found"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    deleteChapterHandler
  );
}
