import { z } from "zod";

export const exerciseSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  createdById: z.string(),
  language: z.enum(["JAVASCRIPT", "HTML", "CSS"]).default("JAVASCRIPT"),
  functionName: z.string().optional(),
  parameters: z.array(z.string()).optional(),
  tests: z.any().optional(),
  htmlTemplate: z.string().optional(),
  cssTemplate: z.string().optional(),
});

export const checkExerciseAnswerSchema = z.object({
  exerciseId: z.string(),
  studentId: z.string(),
  solution: z.string(),
});
