import z from "zod";
import { FastifyTypedInstance } from "../types/zod";
import {
  fetchCalendarByEditionHandler,
  publishCalendarHandler,
} from "../controllers/calendar.controller";
import { calendarSchema } from "../schemas/calendar.schema";

export function calendarRoutes(app: FastifyTypedInstance) {
  app.get(
    "/:editionId",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["calendars"],
        description: "Fetch calendar by edition",
        response: {
          200: z
            .object({
              message: z.string(),
              calendar: z.object({
                id: z.string(),
                calendarUrl: z.string(),
                editionId: z.string(),
                createdAt: z.string().datetime(),
                updatedAt: z.string().datetime(),
              }),
            })
            .describe("Calendar fetched successfully"),
          404: z.object({ message: z.string() }).describe("Not found"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    fetchCalendarByEditionHandler
  );

  app.post(
    "/",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["calendars"],
        description: "Create a new calendar",
        body: calendarSchema,
        response: {
          201: z
            .object({
              message: z.string(),
              calendar: z.object({
                id: z.string(),
                calendarUrl: z.string(),
                editionId: z.string(),
                createdAt: z.string().datetime(),
                updatedAt: z.string().datetime(),
              }),
            })
            .describe("Calendar fetched successfully"),
          400: z.object({ message: z.string() }).describe("Bad request"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    publishCalendarHandler
  );
}
