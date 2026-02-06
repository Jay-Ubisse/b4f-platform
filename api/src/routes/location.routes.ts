import z from "zod";
import { FastifyTypedInstance } from "../types/zod";
import {
  createLocationSchema,
  locationSchema,
  locationWithRelationsSchema,
  updateLocationSchema,
} from "../schemas/location.schema";
import {
  createLocationHandler,
  deleteLocationHandler,
  fetchAllLocationsHandler,
  fetchLocationByIdHandler,
  updateLocationHandler,
} from "../controllers/location.controller";

export async function locationRoutes(app: FastifyTypedInstance) {
  app.get(
    "/",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["locations"],
        description: "Fetch all locations",
        response: {
          200: z
            .object({
              message: z.string(),
              locations: z.array(locationWithRelationsSchema),
            })
            .describe("All locations fetched successfully"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    fetchAllLocationsHandler,
  );

  app.get(
    "/:id",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["locations"],
        description: "Fetch location by ID",
        params: z.object({ id: z.string() }),
        response: {
          200: z
            .object({
              message: z.string(),
              location: locationWithRelationsSchema,
            })
            .describe("Location fetched successfully"),
          400: z.object({ message: z.string() }).describe("Bad request"),
          404: z.object({ message: z.string() }).describe("Not found"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    fetchLocationByIdHandler,
  );

  app.post(
    "/",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["locations"],
        description: "Create location",
        body: createLocationSchema,
        response: {
          200: z
            .object({
              message: z.string(),
              location: locationSchema,
            })
            .describe("location created successfully"),
          400: z.object({ message: z.string() }).describe("Bad request"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    createLocationHandler,
  );

  app.put(
    "/:id",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["locations"],
        description: "Update location",
        params: z.object({ id: z.string() }),
        body: updateLocationSchema,
        response: {
          200: z
            .object({
              message: z.string(),
              location: locationSchema,
            })
            .describe("Location updated successfully"),
          400: z.object({ message: z.string() }).describe("Bad request"),
          404: z.object({ message: z.string() }).describe("Not found"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    updateLocationHandler,
  );

  app.delete(
    "/:id",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["locations"],
        description: "Delete location",
        params: z.object({ id: z.string() }),
        response: {
          200: z
            .object({
              message: z.string(),
            })
            .describe("Location deleted successfully"),
          404: z.object({ message: z.string() }).describe("Not found"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    deleteLocationHandler,
  );
}
