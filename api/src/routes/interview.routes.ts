import z from "zod";
import { FastifyTypedInstance } from "../types/zod";
import {
  confirmInterviewHandler,
  scheduleInterviewHanlder,
  deleteInterviewHandler,
  endInterviewHandler,
  fetchInterviewByCandidateHandler,
  fetchInterviewHandler,
  fetchInterviewsByEditionHandler,
} from "../controllers/interview.controller";

export async function interviewRoutes(app: FastifyTypedInstance) {
  app.get(
    "/edition/:editionId",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["interviews"],
        description: "Fetch interviews by edition",
        response: {
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    fetchInterviewsByEditionHandler
  );

  app.get(
    "/:interviewId",
    {
      //preHandler: app.authenticate,
      schema: {
        tags: ["interviews"],
        description: "Fetch interview by ID",
        response: {
          400: z.object({ message: z.string() }).describe("Bad request"),
          404: z.object({ message: z.string() }).describe("Not found"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    fetchInterviewHandler
  );

  app.get(
    "/candidate/:candidateId",
    {
      //preHandler: app.authenticate,
      schema: {
        tags: ["interviews"],
        description: "Fetch interview by candidate",
        response: {
          400: z.object({ message: z.string() }).describe("Bad request"),
          404: z.object({ message: z.string() }).describe("Not found"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    fetchInterviewByCandidateHandler
  );

  app.post(
    "/",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["interviews"],
        description: "Create interview",
        response: {
          400: z.object({ message: z.string() }).describe("Bad request"),
          404: z.object({ message: z.string() }).describe("Not found"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    scheduleInterviewHanlder
  );

  app.put(
    "/:interviewId",
    {
      //preHandler: app.authenticate,
      schema: {
        tags: ["interviews"],
        description: "Update interview",
        response: {
          400: z.object({ message: z.string() }).describe("Bad request"),
          404: z.object({ message: z.string() }).describe("Not found"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    scheduleInterviewHanlder
  );

  app.put(
    "/:interviewId/confirm-interview",
    {
      //preHandler: app.authenticate,
      schema: {
        tags: ["interviews"],
        description: "Confirm interview",
        response: {
          200: z
            .object({ message: z.string() })
            .describe("Interview confirmed successfully"),
          400: z.object({ message: z.string() }).describe("Bad request"),
          404: z.object({ message: z.string() }).describe("Not found"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    confirmInterviewHandler
  );

  app.put(
    "/:interviewId/end-interview",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["interviews"],
        description: "Confirm interview",
        response: {
          200: z
            .object({ message: z.string() })
            .describe("Interview confirmed successfully"),
          400: z.object({ message: z.string() }).describe("Bad request"),
          404: z.object({ message: z.string() }).describe("Not found"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    endInterviewHandler
  );

  app.delete(
    "/:interviewId",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["interviews"],
        description: "Delete interview",
        response: {
          400: z.object({ message: z.string() }).describe("Bad request"),
          404: z.object({ message: z.string() }).describe("Not found"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    deleteInterviewHandler
  );
}
