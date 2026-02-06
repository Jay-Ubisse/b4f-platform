import z from "zod";
import { FastifyTypedInstance } from "../types/zod";
import {
  createStudentHandler,
  fecthStudentsHandler,
  fetchStudentsByEditionHandler,
} from "../controllers/student.controller";
import { createStudentShema } from "../schemas/student.schema";

export function studentRoutes(app: FastifyTypedInstance) {
  app.get(
    "/edition/:editionId",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["students"],
        description: "Fetch students by edition",
        response: {
          404: z.object({ message: z.string() }).describe("Not found"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    fetchStudentsByEditionHandler,
  );

  app.get(
    "/",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["students"],
        description: "Fetch all students",
        response: {
          404: z.object({ message: z.string() }).describe("Not found"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    fecthStudentsHandler,
  );

  app.post(
    "/",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["students"],
        description: "Create student",
        response: {
          400: z.object({ message: z.string() }).describe("Bad request"),
          404: z.object({ message: z.string() }).describe("Not found"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    createStudentHandler,
  );
}
