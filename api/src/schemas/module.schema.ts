import z from "zod";

export const createModuleSchema = z.object({
  courseId: z.string({ required_error: "Course ID is required" }),
  name: z.string({ required_error: "Name is required" }),
  bannerUrl: z.string().optional(),
  createdById: z.string({ required_error: "Creator ID is required" }),
});

export const updateModuleSchema = createModuleSchema.partial();
