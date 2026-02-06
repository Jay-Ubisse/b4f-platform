import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { hash } from "bcrypt";
import { Resend } from "resend";

import { prisma } from "../lib/db";
import { createStudentShema } from "../schemas/student.schema";
import { passwordGenerator } from "../lib/password-generator";
import { StudentRegistrationTemplate } from "../email/student-registration";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function createStudentHandler(
  request: FastifyRequest<{ Body: z.infer<typeof createStudentShema> }>,
  reply: FastifyReply,
) {
  try {
    const { candidateId, classId } = request.body;

    const candidate = await prisma.candidate.findUnique({
      where: {
        id: candidateId,
      },
    });

    if (!candidate) {
      return reply.status(404).send({ message: "Candidate not found" });
    }

    const existingStudent = await prisma.student.findUnique({
      where: {
        email: candidate.email,
      },
    });

    if (existingStudent) {
      return reply.status(409).send({ message: "Student already exists" });
    }

    const password = passwordGenerator({
      passwordLength: 8,
      useLowerCase: true,
      useNumbers: true,
      useSymbols: false,
      useUpperCase: true,
    });
    const hashedPassword = await hash(password, 10);

    const student = await prisma.$transaction(
      async (tx) => {
        await prisma.user.create({
          data: {
            email: candidate.email.toLocaleLowerCase().trim(),
            name: candidate.name,
            password: hashedPassword,
            role: "STUDENT",
            student: {
              create: {
                birthDate: candidate.birthDate,
                classId,
                editionId: candidate.editionId,
                email: candidate.email,
                gender: candidate.gender,
                name: candidate.name,
                phone: candidate.phone,
                whatsapp: candidate.whatsapp ? candidate.whatsapp : null,
              },
            },
          },
        });

        const student = await prisma.student.findUnique({
          where: {
            email: candidate.email,
          },
          include: {
            class: true,
            edition: {
              include: {
                course: true,
              },
            },
          },
        });

        if (!student) {
          console.error("Student not created");
          throw new Error("STUDENT_CREATE_ERROR");
        }

        await resend.emails.send({
          from: "Bytes 4 Future <comercial@iabil.co.mz>",
          to: [student.email],
          subject:
            "Cofirmação de Admissão e Registro na Plataforma | Bytes 4 Future",
          react: StudentRegistrationTemplate({
            name: student.name,
            email: student.email,
            password: password,
            course: student.edition.course.name,
            shift: student.class.shift,
          }) as React.ReactElement,
        });

        return student;
      },

      { timeout: 20000 },
    );

    return reply.status(201).send({
      message: "Student created successfully",
      student,
    });
  } catch (error: any) {
    if (error?.message === "STUDENT_CREATE_ERROR") {
      return reply
        .status(500)
        .send({ message: "Error creating student", error });
    }

    console.error("Error creating student:", error);
    return reply.status(500).send({ message: "Internal server error" });
  }
}

export async function fecthStudentsHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const students = await prisma.student.findMany({
      relationLoadStrategy: "query",
      include: {
        edition: true,
        class: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return reply.status(200).send({ message: "ok", students });
  } catch (error) {
    console.error("Error fetching students:", error);
    return reply.status(500).send({ message: "Internal server error" });
  }
}

export async function fetchStudentsByEditionHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { editionId } = request.params as { editionId: string };

    const students = await prisma.student.findMany({
      relationLoadStrategy: "query",
      include: {
        edition: true,
        class: true,
      },
      orderBy: {
        createdAt: "asc",
      },
      where: {
        editionId,
      },
    });

    return reply.status(200).send({ message: "ok", students });
  } catch (error) {
    console.log("Error fetching students:", error);
    return reply.status(500).send({ message: "Internal server error" });
  }
}
