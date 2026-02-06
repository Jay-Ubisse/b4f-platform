import z from "zod";
import { FastifyTypedInstance } from "../types/zod";
import {
  createAttendanceHandler,
  fetchAttendanceByEditionHandler,
  initializeAttendanceRangeHandler,
  manageStudentPresenceHanlder,
} from "../controllers/attendance.controller";
import {
  attendanceSchema,
  initializeAttendanceRangeSchema,
} from "../schemas/attendance.schema";

export function attendanceRoutes(app: FastifyTypedInstance) {
  app.get(
    "/edition/:editionId",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["attendance"],
        description: "Fetch attendance by edition",
        response: {
          404: z.object({ message: z.string() }).describe("Not found"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    fetchAttendanceByEditionHandler
  );

  app.post(
    "/",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["attendace"],
        description: "Create attendance",
        body: attendanceSchema,
        response: {
          201: z
            .object({
              message: z.string(),
              attendance: z.object({
                id: z.string(),
                studentId: z.string(),
                editionId: z.string(),
                status: z.enum(["PRESENT", "ABSENT"]),
              }),
            })
            .describe("Attendance fetched successfully"),
          400: z.object({ message: z.string() }).describe("Bad request"),
          404: z.object({ message: z.string() }).describe("Not found"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    createAttendanceHandler
  );

  app.post(
    "/initialize",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["attendace"],
        description: "Initialize attendance",
        body: initializeAttendanceRangeSchema,
        response: {
          400: z.object({ message: z.string() }).describe("Bad request"),
          404: z.object({ message: z.string() }).describe("Not found"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    initializeAttendanceRangeHandler
  );

  app.put(
    "/manage-presence",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["attendace"],
        description: "Initialize attendance",
        body: attendanceSchema,
        response: {
          400: z.object({ message: z.string() }).describe("Bad request"),
          404: z.object({ message: z.string() }).describe("Not found"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    manageStudentPresenceHanlder
  );
}
