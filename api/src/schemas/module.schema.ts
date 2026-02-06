import z from "zod";

export const moduleSchema = z.object({
  name: z.string({ required_error: "Name is required" }),
  bannerUrl: z.string().optional(),
  createdById: z.string({ required_error: "Creator ID is required" }),
});
