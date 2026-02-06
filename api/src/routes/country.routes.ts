import z from "zod";
import {
  createCountryHandler,
  deleteCountryHandler,
  fetchAllCountriesHandler,
  fetchCountryByIdHandler,
  updateCountryHandler,
} from "../controllers/country.controller";
import { FastifyTypedInstance } from "../types/zod";
import {
  countrySchema,
  countryWithRelationsSchema,
  creeateCountrySchema,
  updateCountrySchema,
} from "../schemas/country.schema";

export async function countryRoutes(app: FastifyTypedInstance) {
  app.get(
    "/",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["countries"],
        description: "Fetch all countries",
        response: {
          200: z
            .object({
              message: z.string(),
              countries: z.array(countryWithRelationsSchema),
            })
            .describe("All countries fetched successfully"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    fetchAllCountriesHandler,
  );

  app.get(
    "/:id",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["countries"],
        description: "Fetch country by ID",
        params: z.object({ id: z.string() }),
        response: {
          200: z
            .object({
              message: z.string(),
              country: countryWithRelationsSchema,
            })
            .describe("Country fetched successfully"),
          400: z.object({ message: z.string() }).describe("Bad request"),
          404: z.object({ message: z.string() }).describe("Not found"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    fetchCountryByIdHandler,
  );

  app.post(
    "/",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["countries"],
        description: "Create country",
        body: creeateCountrySchema,
        response: {
          200: z
            .object({
              message: z.string(),
              country: countrySchema,
            })
            .describe("Country created successfully"),
          400: z.object({ message: z.string() }).describe("Bad request"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    createCountryHandler,
  );

  app.put(
    "/:id",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["countries"],
        description: "Update country",
        params: z.object({ id: z.string() }),
        body: updateCountrySchema,
        response: {
          200: z
            .object({
              message: z.string(),
              country: countrySchema,
            })
            .describe("Country updated successfully"),
          400: z.object({ message: z.string() }).describe("Bad request"),
          404: z.object({ message: z.string() }).describe("Not found"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    updateCountryHandler,
  );

  app.delete(
    "/:id",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["countries"],
        description: "Delete country",
        params: z.object({ id: z.string() }),
        response: {
          200: z
            .object({
              message: z.string(),
            })
            .describe("Country deleted successfully"),
          404: z.object({ message: z.string() }).describe("Not found"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    deleteCountryHandler,
  );
}
