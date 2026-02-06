import z from "zod";

export const calendarSchema = z.object({
  editionId: z.string({ required_error: "Edition ID is required" }),
  calendarUrl: z
    .string({ required_error: "Calendar URL is required" })
    .url("Invalid URL format"),
});
