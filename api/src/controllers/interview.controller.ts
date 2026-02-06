import { FastifyReply, FastifyRequest } from "fastify";

import { prisma } from "../lib/db";
import z from "zod";
import { Resend } from "resend";
import { createInterviewSchema } from "../schemas/interview.schema";
import { ApplicationCompletedEmail } from "../email/application-completed";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function fetchInterviewsByEditionHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { editionId } = request.params as { editionId: string };

    const interviews = await prisma.interview.findMany({
      relationLoadStrategy: "query",
      include: {
        edition: {
          include: {
            course: true,
            country: true,
            location: true,
          },
        },
        candidate: true,
      },
      where: {
        editionId,
      },
    });

    return reply.status(200).send({ message: "ok", interviews });
  } catch (error) {
    console.log("Error fetching interviews", error);
    return reply.status(400).send({ message: "Internal server error" });
  }
}

export async function fetchInterviewHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { interviewId } = request.params as { interviewId: string };

    if (!interviewId) {
      return reply.status(400).send({ message: "Interview ID not provided" });
    }

    const interview = await prisma.interview.findUnique({
      relationLoadStrategy: "query",
      include: {
        edition: {
          include: {
            course: true,
            country: true,
            location: true,
          },
        },
        candidate: true,
      },
      where: {
        id: interviewId,
      },
    });

    return reply.status(200).send({ message: "ok", interview });
  } catch (error) {
    console.log("Error fetching interview", error);
    return reply.status(500).send({ message: "Internal server error" });
  }
}

export async function fetchInterviewByCandidateHandler(
  request: FastifyRequest<{ Params: { candidateId: string } }>,
  reply: FastifyReply,
) {
  try {
    const { candidateId } = request.params;

    if (!candidateId) {
      return reply.status(400).send({ message: "Candidate ID not provided" });
    }

    const interview = await prisma.interview.findUnique({
      relationLoadStrategy: "query",
      include: {
        edition: true,
        candidate: true,
      },
      where: {
        candidateId: candidateId,
      },
    });

    if (!interview) {
      return reply.status(404).send({ message: "Interview not provided" });
    }

    return reply.status(200).send({ message: "ok", interview });
  } catch (error) {
    console.log("Error fetching interview", error);
    return reply.status(500).send({ message: "Internal server error" });
  }
}

export async function scheduleInterviewHanlder(
  request: FastifyRequest<{ Body: z.infer<typeof createInterviewSchema> }>,
  reply: FastifyReply,
) {
  try {
    const { candidateId, editionId } = request.body;

    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
    });

    if (!candidate) {
      return reply.status(404).send({
        message: "Candidate not found.",
      });
    }

    const interview = await prisma.interview.findUnique({
      where: { candidateId: candidateId },
    });

    if (interview) {
      return reply.status(400).send({
        message: "An interview has already been scheduled for this candidate.",
      });
    }

    const result = await prisma.$transaction(
      async (tx) => {
        const interview = await tx.interview.create({
          data: {
            editionId,
            candidateId,
            status: "SCHEDULED",
          },
        });

        const candidate = await tx.candidate.update({
          data: { status: "INTERVIEW_SCHEDULED" },
          where: { id: candidateId },
        });

        return { interview, candidate };
      },
      { timeout: 20000 },
    );

    const { data: emailData } = await resend.emails.send({
      from: "Bytes 4 Future <comercial@iabil.co.mz>",
      to: [candidate.email],
      subject: "Conclusão de Candidatura – Bytes 4 Future | Bytes 4 Future",
      react: ApplicationCompletedEmail({
        name: candidate.name,
        applicationStatusUrl:
          "https://candidaturas-b4f.vercel.app/search-candidate",
        candidateCode: candidate.code,
      }) as React.ReactElement,
    });

    return reply.status(201).send({
      message: "interview scheduled successfully",
      result,
      emailId: emailData?.id,
    });
  } catch (error) {
    console.log("Error fetching interview", error);
    return reply.status(500).send({ message: "Internal server error" });
  }
}

export async function updateInterviewHandler(
  request: FastifyRequest<{ Body: z.infer<typeof createInterviewSchema> }>,
  reply: FastifyReply,
) {
  try {
    const { interviewId } = request.params as { interviewId: string };

    if (!interviewId) {
      return reply.status(400).send({ message: "interview ID not provided" });
    }

    const { candidateId, editionId, status } = request.body;

    const existinginterview = await prisma.interview.findUnique({
      where: {
        id: interviewId,
      },
    });

    if (!existinginterview) {
      return reply.status(404).send({ message: "No interview found." });
    }

    const interview = await prisma.interview.update({
      data: {
        candidateId,
        editionId,
        status,
      },
      where: {
        id: interviewId,
      },
    });

    return reply
      .status(200)
      .send({ message: "interview updated successfully", interview });
  } catch (error) {
    console.log("Error updating interview", error);
    return reply.status(500).send({ message: "Internal server error" });
  }
}

export async function confirmInterviewHandler(
  request: FastifyRequest<{ Params: { interviewId: string } }>,
  reply: FastifyReply,
) {
  try {
    const { interviewId } = request.params;

    if (!interviewId) {
      return reply.status(400).send({ message: "Candidate ID not provided" });
    }

    const interview = await prisma.interview.findUnique({
      where: {
        id: interviewId,
      },
    });

    if (!interview) {
      return reply.status(404).send({ message: "Interview not found" });
    }

    await prisma.interview.update({
      data: {
        status: "CONFIRMED",
      },
      where: {
        id: interviewId,
      },
    });

    return reply
      .status(200)
      .send({ message: "Interview confirmed successfully" });
  } catch (error) {
    console.log("Error fetching interview", error);
    return reply.status(500).send({ message: "Internal server error" });
  }
}

export async function endInterviewHandler(
  request: FastifyRequest<{
    Params: { interviewId: string };
    Body: z.infer<typeof createInterviewSchema>;
  }>,
  reply: FastifyReply,
) {
  try {
    const { interviewId } = request.params;
    const { result, interviewGuideUrl } = request.body;

    if (!interviewId) {
      return reply.status(400).send({ message: "Candidate ID not provided" });
    }

    const interview = await prisma.interview.findUnique({
      where: {
        id: interviewId,
      },
    });

    if (!interview) {
      return reply.status(404).send({ message: "Interview not found" });
    }

    await prisma.$transaction(async (tx) => {
      await tx.interview.update({
        data: {
          status: "FINISHED",
          result: result,
          interviewGuideUrl,
        },
        where: {
          id: interviewId,
        },
      });

      await tx.candidate.update({
        data: {
          status: result,
        },
        where: {
          id: interview.candidateId,
        },
      });
    });

    return reply
      .status(200)
      .send({ message: "Interview completed successfully" });
  } catch (error) {
    console.log("Error fetching interview", error);
    return reply.status(500).send({ message: "Internal server error" });
  }
}

export async function deleteInterviewHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { interviewId } = request.params as { interviewId: string };

    if (!interviewId) {
      return reply.status(400).send({ message: "interview ID not provided" });
    }

    const existinginterview = await prisma.interview.findUnique({
      where: {
        id: interviewId,
      },
    });

    if (!existinginterview) {
      return reply.status(404).send({ message: "No interview found." });
    }

    const interview = await prisma.interview.delete({
      where: {
        id: interviewId,
      },
    });

    return reply
      .status(200)
      .send({ message: "interview deleted successfully", interview });
  } catch (error) {
    console.log("Error deleting interview", error);
    return reply.status(500).send({ message: "Internal server error" });
  }
}
