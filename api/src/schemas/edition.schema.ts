import z from "zod";

export const editionSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  courseId: z.string(),
  countryId: z.string(),
  locationId: z.string(),
  number: z.number(),
  year: z.number(),
  interviewBookingUrl: z.string().nullable(),
  lessonsStatus: z.string(),
  applicationsStatus: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const createEditionSchema = z.object({
  name: z.string({ required_error: "O nome é obrigatório" }),
  courseId: z.string({ required_error: "O ID do curso é obrigatório" }),
  countryId: z.string({ required_error: "Country ID is required" }),
  locationId: z.string({ required_error: "Location ID is required" }),
  number: z
    .number({ required_error: "O número da edição é obrigatório" })
    .int("O número deve ser inteiro")
    .positive("O número deve ser positivo"),
  year: z
    .number({ required_error: "O ano da edição é obrigatório" })
    .int("O número deve ser inteiro")
    .positive("O número deve ser positivo"),
  interviewBookingUrl: z.string().url("Deve ser uma URL válida").optional(),
  lessonsStatus: z
    .enum(["OPEN", "CLOSED"], {
      required_error: "O estado de aulas é obrigatório",
    })
    .default("CLOSED"),
  applicationsStatus: z
    .enum(["OPEN", "CLOSED"], {
      required_error: "O estado de candidaturas é obrigatório",
    })
    .default("CLOSED"),
});

export const updateEditionSchema = createEditionSchema.partial();
