import z from "zod";

export const attendanceSchema = z.object({
  studentId: z.string({ required_error: "Student ID is required" }),
  editionId: z.string({ required_error: "Edition ID is required" }),
  status: z.enum(["PRESENT", "ABSENT"], {
    required_error: "Status is required",
  }),
  date: z.coerce.date({ required_error: "Date is required" }),
});

export const initializeAttendanceRangeSchema = z.object({
  editionId: z.string(),
  startDate: z.string().refine((value) => !isNaN(Date.parse(value)), {
    message: "Invalid start date",
  }),
  endDate: z.string().refine((value) => !isNaN(Date.parse(value)), {
    message: "Invalid end date",
  }),
});
