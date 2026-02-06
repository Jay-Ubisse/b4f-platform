import z from "zod";

export const candidateSchema = z.object({
  name: z.string({
    required_error: "O nome é obrigatório.",
  }),
  email: z
    .string({
      required_error: "O email é obrigatório.",
    })
    .email("O email fornecido não é válido."),
  phone: z.string({
    required_error: "O telefone é obrigatório.",
  }),
  gender: z.enum(["MALE", "FEMALE", "OTHER"], {
    required_error: "O género é obrigatório",
  }),
  whatsapp: z.string().optional(),
  birthDate: z.string({
    required_error: "A data de nascimento é obrigatória.",
  }),
  editionId: z.string({
    required_error: "O ID da edição é obrigatória.",
  }),
  motivation: z.string({
    required_error: "A motivação é obrigatória.",
  }),
  status: z
    .enum(["PENDING", "INTERVIEW_SCHEDULED", "ADMITTED", "NOT_ADMITTED"])
    .default("PENDING"),
});
