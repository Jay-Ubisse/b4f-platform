import z from "zod";

export const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  role: z.string(),
});

export const createuUserSchema = z.object({
  name: z.string({ required_error: "Name is required." }),
  email: z
    .string({ required_error: "Email is required." })
    .email("Invalid email format."),
  role: z.enum(["ADMIN", "TEACHER", "STUDENT", "ALUMNI", "RECRUITER"], {
    required_error: "Role is required.",
    invalid_type_error: "Role must be one of the predefined values.",
  }),
});

export const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Invalid email format"),
  password: z.string({ required_error: "Password is required" }),
});
