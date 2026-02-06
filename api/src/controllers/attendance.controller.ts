import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import {
  attendanceSchema,
  initializeAttendanceRangeSchema,
} from "../schemas/attendance.schema";
import { prisma } from "../lib/db";
import { count } from "console";
import { generateDateRange } from "../lib/data-range-generator";

export async function fetchAttendanceHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const attendace = await prisma.attendance.findMany({
      relationLoadStrategy: "query",
      include: {
        student: true,
      },
    });

    const serializedAttendace = attendace.map((att) => ({
      ...att,
      createdAt: att.createdAt.toISOString(),
      updatedAt: att.updatedAt.toISOString(),
    }));

    return reply.status(200).send({
      message: "ok",
      attendance: serializedAttendace,
    });
  } catch (error) {
    console.error("Error fetching calendar:", error);
    return reply.status(500).send({ message: "Internal server error" });
  }
}

export async function fetchAttendanceByEditionHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { editionId } = request.params as { editionId: string };

    const attendaces = await prisma.attendance.findMany({
      relationLoadStrategy: "query",
      where: {
        editionId,
      },
      include: {
        student: true,
        edition: true,
      },
    });

    const serializedAttendaces = attendaces.map((att) => ({
      ...att,
      createdAt: att.createdAt.toISOString(),
      updatedAt: att.updatedAt.toISOString(),
    }));

    return reply.status(200).send({
      message: "ok",
      attendance: serializedAttendaces,
    });
  } catch (error) {
    console.error("Error fetching calendar:", error);
    return reply.status(500).send({ message: "Internal server error" });
  }
}

export async function createAttendanceHandler(
  request: FastifyRequest<{ Body: z.infer<typeof attendanceSchema> }>,
  reply: FastifyReply
) {
  try {
    const { date, status, editionId, studentId } = request.body;

    const attendace = await prisma.attendance.create({
      data: {
        date,
        status,
        studentId,
        editionId,
      },
    });

    return reply.status(201).send({
      message: "Attendace created successfully",
      attendace: {
        id: attendace.id,
        status: attendace.status,
        studentId: attendace.studentId,
        editionId: attendace.editionId,
      },
    });
  } catch (error) {
    console.error("Error creating attendace:", error);
    return reply.status(500).send({ message: "Internal server error" });
  }
}

export async function initializeAttendanceRangeHandler(
  request: FastifyRequest<{
    Body: z.infer<typeof initializeAttendanceRangeSchema>;
  }>,
  reply: FastifyReply
) {
  try {
    const { startDate, endDate, editionId } = request.body;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      return reply
        .status(400)
        .send({ message: "Start date must be before end date." });
    }

    // Buscar alunos da edição
    const students = await prisma.student.findMany({
      where: { editionId },
    });

    if (students.length === 0) {
      return reply.status(404).send({ message: "No students found." });
    }

    // Gerar as datas no intervalo
    const dates = generateDateRange(start, end);
    /**
    if (dates.length > 90) {
      return reply.status(400).send({
        message: "The interval cannot exceed 90 days for performance reasons.",
      });
    } */

    // Criar registros
    const records = [];

    for (const student of students) {
      for (const date of dates) {
        records.push({
          editionId,
          studentId: student.id,
          date,
        });
      }
    }

    // Inserir em batches para evitar overload
    const batchSize = 500;
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      await prisma.attendance.createMany({ data: batch });
    }

    return reply.status(201).send({
      message: "Attendance initialized successfully for date range",
      totalDays: dates.length,
      totalRecords: records.length,
    });
  } catch (error) {
    console.error("Error creating attendance range:", error);
    return reply.status(500).send({ message: "Internal server error" });
  }
}

export async function manageStudentPresenceHanlder(
  request: FastifyRequest<{ Body: z.infer<typeof attendanceSchema> }>,
  reply: FastifyReply
) {
  try {
    const { date, editionId, status, studentId } = request.body;

    const existingAttendance = await prisma.attendance.findUnique({
      where: {
        studentId_date_editionId: {
          date: new Date(date),
          editionId,
          studentId,
        },
      },
    });

    if (!existingAttendance) {
      console.log("Attendance not found");
      return reply.status(404).send({ message: "Attendance not found" });
    }

    const updatedAttendance = await prisma.attendance.update({
      where: {
        studentId_date_editionId: {
          date,
          editionId,
          studentId,
        },
      },
      data: {
        status,
      },
    });

    return reply.status(200).send({ message: "ok", updatedAttendance });
  } catch (error) {
    console.error("Error managing attendace:", error);
    return reply.status(500).send({ message: "Internal server error" });
  }
}
