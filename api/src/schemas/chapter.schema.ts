import z from "zod";

export const chapterSchema = z.object({
  name: z.string({ required_error: "Name is required" }),
  bannerUrl: z.string().optional(),
  videoUrl: z.string().optional(),
  content: z.string({ required_error: "Content is required" }),
  createdById: z.string({ required_error: "Creator ID is required" }),
  moduleId: z.string({ required_error: "Module ID is required" }),
});
