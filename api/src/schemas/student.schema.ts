import { z } from "zod";

export const getStudentSchema = z.object({
  id: z.string(),
  editionId: z.string({ required_error: "Edition ID is required" }),
  name: z.string({ required_error: "Student name is required" }),
  email: z.string({ required_error: "Student email is required" }),
  phone: z.string({ required_error: "Student phone is required" }),
  gender: z.enum(["MALE", "FEMALE"], {
    required_error: "Student gender is required",
  }),
  whatsapp: z.string().nullable(),
  birthDate: z
    .string({ required_error: "Student birthdate is required" })
    .datetime("Invalid time format"),
  location: z.string({ required_error: "location is required" }),
  resumeUrl: z.string().nullable(),
  linkedinUrl: z.string().nullable(),
  githubUrl: z.string().nullable(),
  certificateUrl: z.string().nullable(),
  classId: z.string({ required_error: "Class ID is required" }),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const createStudentShema = z.object({
  classId: z.string({ required_error: "Class ID is required" }),
  candidateId: z.string({ required_error: "Candidate ID is required" }),
});
