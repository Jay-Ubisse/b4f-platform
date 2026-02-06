import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../lib/db";
import z from "zod";
import { Resend } from "resend";
import { candidateSchema } from "../schemas/candidate.schema";
import { generateCandidateCode } from "../lib/code-generators";
import ApplicationConfirmation from "../email/application-confirmation";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function fetchCandidatesHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const candidates = await prisma.candidate.findMany({
      relationLoadStrategy: "query",
      include: {
        edition: {
          include: {
            course: true,
            location: true,
            country: true,
          },
        },
        interview: true,
      },
    });

    return reply.status(200).send({ message: "ok", candidates });
  } catch (error) {
    console.log("Error fetching candidates", error);
    return reply.status(500).send({ message: "Internal server error" });
  }
}

export async function fetchCandidatesByEditionHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { editionId } = request.params as { editionId: string };

    const candidates = await prisma.candidate.findMany({
      relationLoadStrategy: "query",
      include: {
        edition: {
          include: {
            course: true,
            location: true,
            country: true,
          },
        },
        interview: true,
      },
      where: {
        editionId,
      },
    });

    return reply.status(200).send({ message: "ok", candidates });
  } catch (error) {
    console.log("Error fetching candidates", error);
    return reply.status(500).send({ message: "Internal server error" });
  }
}

export async function fetchCandidateHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { candidateId } = request.params as { candidateId: string };

    if (!candidateId) {
      return reply.status(400).send({ message: "candidate ID not provided" });
    }

    const candidate = await prisma.candidate.findUnique({
      relationLoadStrategy: "query",
      include: {
        edition: {
          include: {
            course: true,
            location: true,
            country: true,
          },
        },
        interview: true,
      },
      where: {
        id: candidateId,
      },
    });

    return reply.status(200).send({ message: "ok", candidate });
  } catch (error) {
    console.log("Error fetching candidate", error);
    return reply.status(500).send({ message: "Internal server error" });
  }
}

export async function createCandidateHanlder(
  request: FastifyRequest<{ Body: z.infer<typeof candidateSchema> }>,
  reply: FastifyReply,
) {
  try {
    const {
      birthDate,
      email,
      gender,
      editionId,
      motivation,
      name,
      phone,
      status,
      whatsapp,
    } = request.body;

    const existingCandidate = await prisma.candidate.findUnique({
      where: {
        email,
        editionId,
      },
    });

    if (existingCandidate) {
      return reply
        .status(400)
        .send({ message: "Este candidato já candidatou-se nesta edição." });
    }

    const code = generateCandidateCode();

    const candidate = await prisma.candidate.create({
      data: {
        birthDate,
        email,
        gender,
        code,
        motivation,
        name,
        phone,
        status,
        whatsapp,
        editionId: editionId,
      },
    });

    await resend.emails.send({
      from: "Bytes 4 Future <comercial@iabil.co.mz>",
      to: [candidate.email],
      subject: "Confirmação de Candidatura – Bytes 4 Future | Bytes 4 Future",
      react: ApplicationConfirmation({
        name: candidate.name,
        code: candidate.code,
      }) as React.ReactElement,
    });

    return reply.status(201).send({
      message: "Candidate created successfully",
      candidate,
    });
  } catch (error) {
    console.log("Error fetching candidate", error);
    return reply.status(400).send({ message: "Internal server error" });
  }
}

export async function updateCandidateHanlder(
  request: FastifyRequest<{ Body: z.infer<typeof candidateSchema> }>,
  reply: FastifyReply,
) {
  try {
    const { candidateId } = request.params as { candidateId: string };

    if (!candidateId) {
      return reply.status(400).send({ message: "candidate ID not provided" });
    }

    const { name, phone, whatsapp, birthDate, editionId, motivation, status } =
      request.body;

    const existingCandidate = await prisma.candidate.findUnique({
      where: {
        id: candidateId,
      },
    });

    if (!existingCandidate) {
      return reply.status(404).send({ message: "No candidate found." });
    }

    const candidate = await prisma.candidate.update({
      data: {
        name,
        phone,
        whatsapp,
        birthDate,
        editionId,
        motivation,
        status,
      },
      where: {
        id: candidateId,
      },
    });

    return reply
      .status(200)
      .send({ message: "Candidate updated successfully", candidate });
  } catch (error) {
    console.log("Error updating candidate", error);
    return reply.status(400).send({ message: "Internal server error" });
  }
}

export async function deleteCandidateHandler(
  request: FastifyRequest<{ Body: z.infer<typeof candidateSchema> }>,
  reply: FastifyReply,
) {
  try {
    const { candidateId } = request.params as { candidateId: string };

    if (!candidateId) {
      return reply.status(400).send({ message: "candidate ID not provided" });
    }

    const existingCandidate = await prisma.candidate.findUnique({
      where: {
        id: candidateId,
      },
    });

    if (!existingCandidate) {
      return reply.status(404).send({ message: "No candidate found." });
    }

    const candidate = await prisma.candidate.delete({
      where: {
        id: candidateId,
      },
    });

    return reply
      .status(200)
      .send({ message: "Candidate deleted successfully" });
  } catch (error) {
    console.log("Error deleting candidate", error);
    return reply.status(400).send({ message: "Internal server error" });
  }
}
