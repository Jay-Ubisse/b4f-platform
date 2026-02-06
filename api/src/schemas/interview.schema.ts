import z from "zod";

export const createInterviewSchema = z.object({
  status: z.enum(["SCHEDULED", "CONFIRMED", "FINISHED"]).default("SCHEDULED"),
  result: z.enum(["ADMITTED", "NOT_ADMITTED", "PENDING"]).default("PENDING"),
  candidateId: z.string({ required_error: "O ID do candidato é obrigatório" }),
  interviewGuideUrl: z.string().optional(),
  editionId: z.string({ required_error: "O ID da edição é obrigatório" }),
});

export const getInterviewSchema = z.object({
  id: z.string(),
  status: z.enum(["SCHEDULED", "CONFIRMED", "DONE"]).default("SCHEDULED"),
  result: z.enum(["ADMITTED", "NOT_ADMITTED"]).default("NOT_ADMITTED"),
  candidateId: z.string({ required_error: "O ID do candidato é obrigatório" }),
  editionId: z.string({ required_error: "O ID da edição é obrigatório" }),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
