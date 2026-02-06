import z from "zod";

export const classSchema = z.object({
  editionId: z.string({ required_error: "Edition ID is required" }),
  capacity: z
    .number({ required_error: "A capacidade da turma é obrigatória" })
    .int("O número deve ser inteiro")
    .positive("O número deve ser positivo"),
  shift: z.enum(["MORNING", "AFTERNOON"], {
    required_error: "O turno é obrigatório",
  }),
});
