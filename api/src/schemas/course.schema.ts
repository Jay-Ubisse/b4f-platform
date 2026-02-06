import z from "zod";
import { editionSchema } from "./edition.schema";
import { userSchema } from "./user.schema";

export const courseSchema = z.object({
  id: z.string(),
  name: z.string(),
  duration: z.number().int().positive(),
  tags: z.string().nullable(),
  bannerUrl: z.string().nullable(),
  modulesNumber: z.number().int().positive(),
  chaptersNumber: z.number().int().positive(),
  quizzesNumber: z.number().int().positive(),
  createdById: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const courseWithRelationsSchema = z.lazy(() =>
  courseSchema.extend({
    editions: z.array(editionSchema),
    createdBy: userSchema,
  }),
);

export const createCourseSchema = z.object({
  name: z.string(),
  duration: z.number().int().positive().optional(),
  modality: z.enum(["IN_PERSON", "ONLINE", "HYBRID"]),
  tags: z.string().optional(),
  bannerUrl: z.string().optional(),
  createdById: z.string(),
});

export const updateCourseSchema = createCourseSchema.partial();
