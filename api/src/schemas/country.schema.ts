import z from "zod";

import { locationSchema } from "./location.schema";

export const countrySchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const countryWithRelationsSchema = z.lazy(() =>
  countrySchema.extend({
    locations: z.array(locationSchema),
  }),
);

export const creeateCountrySchema = z.object({
  name: z.string(),
});

export const updateCountrySchema = z.object({
  name: z.string(),
});
