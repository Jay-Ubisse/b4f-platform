import z from "zod";

export const quizzItemSchema = z.object({
  quizzId: z.string().min(1, { message: "Quizz ID is required" }),
  question: z.string().min(1, { message: "Question is required" }),
  option1: z.string().min(1, { message: "Option 1 is required" }),
  option2: z.string().min(1, { message: "Option 2 is required" }),
  option3: z.string().optional(),
  option4: z.string().optional(),
  answer: z.string().min(1, { message: "Answer is required" }),
});

export const quizzSchema = z.object({
  name: z.string().min(1, { message: "Quizz name is required" }),
  chapterId: z.string().min(1, { message: "Chapter ID is required" }),
  createdById: z.string().min(1, { message: "Creator ID is required" }),
});

export const checkQuizzAnswerSchema = z.object({
  quizzItemId: z.string().min(1, "Quizz item ID is required"),
  studentAnswer: z.string().min(1, "Student answer is required"),
});
