import z from "zod";

import { countrySchema } from "./country.schema";

export const locationSchema = z.object({
  id: z.string(),
  name: z.string(),
  countryId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const locationWithRelationsSchema = z.lazy(() =>
  locationSchema.extend({
    country: countrySchema,
  }),
);

export const createLocationSchema = z.object({
  name: z.string(),
  countryId: z.string(),
});

export const updateLocationSchema = createLocationSchema.partial();
