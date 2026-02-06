import z from "zod";
import {
  createCourseHanlder,
  deleteCourseHandler,
  fetchCourseByIdHandler,
  fetchCoursesHandler,
  updateCourseHanlder,
} from "../controllers/course.controller";
import { FastifyTypedInstance } from "../types/zod";

export async function courseRoutes(app: FastifyTypedInstance) {
  app.get(
    "/",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["courses"],
        description: "Fetch all courses",
        response: {
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    fetchCoursesHandler,
  );

  app.get(
    "/:id",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["courses"],
        description: "Fetch course by ID",
        params: z.object({ id: z.string() }),
        response: {
          400: z.object({ message: z.string() }).describe("Bad request"),
          404: z.object({ message: z.string() }).describe("Not found"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    fetchCourseByIdHandler,
  );

  app.post(
    "/",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["courses"],
        description: "Create course",
        response: {
          400: z.object({ message: z.string() }).describe("Bad request"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    createCourseHanlder,
  );

  app.put(
    "/:id",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["courses"],
        description: "Update course",
        params: z.object({ id: z.string() }),
        response: {
          400: z.object({ message: z.string() }).describe("Bad request"),
          404: z.object({ message: z.string() }).describe("Not found"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    updateCourseHanlder,
  );

  app.delete(
    "/:id",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["courses"],
        description: "Delete course",
        params: z.object({ id: z.string() }),
        response: {
          200: z
            .object({
              message: z.string(),
            })
            .describe("Course delete successfully"),
          400: z.object({ message: z.string() }).describe("Bad request"),
          404: z.object({ message: z.string() }).describe("Not found"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    deleteCourseHandler,
  );
}
