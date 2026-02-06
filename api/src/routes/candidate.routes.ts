import z from "zod";
import { FastifyTypedInstance } from "../types/zod";
import {
  createCandidateHanlder,
  deleteCandidateHandler,
  fetchCandidateHandler,
  fetchCandidatesByEditionHandler,
  fetchCandidatesHandler,
  updateCandidateHanlder,
} from "../controllers/candidate.controller";

export async function candidateRoutes(app: FastifyTypedInstance) {
  app.get(
    "/",
    {
      //preHandler: app.authenticate,
      schema: {
        tags: ["candidates"],
        description: "Fetch all candidates",
        response: {
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    fetchCandidatesHandler,
  );

  app.get(
    "/edition/:editionId",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["candidates"],
        description: "Fetch candidates by edition",
        response: {
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    fetchCandidatesByEditionHandler,
  );

  app.get(
    "/:candidateId",
    {
      //preHandler: app.authenticate,
      schema: {
        tags: ["candidates"],
        description: "Fetch candidate by ID",
        response: {
          400: z.object({ message: z.string() }).describe("Bad request"),
          404: z.object({ message: z.string() }).describe("Not found"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    fetchCandidateHandler,
  );

  app.post(
    "/",
    {
      //preHandler: app.authenticate,
      schema: {
        tags: ["candidates"],
        description: "Create candidate",
        response: {
          400: z.object({ message: z.string() }).describe("Bad request"),
          404: z.object({ message: z.string() }).describe("Not found"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    createCandidateHanlder,
  );

  app.put(
    "/:candidateId",
    {
      //preHandler: app.authenticate,
      schema: {
        tags: ["candidates"],
        description: "Update candidate",
        response: {
          200: z
            .object({
              message: z.string(),
              candidate: z.object({
                id: z.string(),
                name: z.string(),
                email: z.string(),
                phone: z.string().nullable(),
                code: z.string(),
                gender: z.string(),
                whatsapp: z.string().nullable(),
                birthDate: z.coerce.date(),
                program: z.string(),
                location: z.string(),
                motivation: z.string(),
                status: z.string(),
                createdById: z.string(),
                createdAt: z.coerce.date(),
                updatedAt: z.coerce.date(),
              }),
            })
            .describe("Candidate updated sucessfully."),
          400: z.object({ message: z.string() }).describe("Bad request"),
          404: z.object({ message: z.string() }).describe("Not found"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    updateCandidateHanlder,
  );

  app.delete(
    "/:candidateId",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["candidates"],
        description: "Delete candidate",
        response: {
          200: z
            .object({
              message: z.string(),
            })
            .describe("Delete candidate"),
          400: z.object({ message: z.string() }).describe("Bad request"),
          404: z.object({ message: z.string() }).describe("Not found"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    deleteCandidateHandler,
  );
}
