import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../lib/db";
import z from "zod";
import { quizzSchema } from "../schemas/quizz.schema";

export async function fetchQuizzesHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const quizzes = await prisma.quizz.findMany({
      relationLoadStrategy: "query",
      include: {
        chapter: {
          include: {
            module: true,
          },
        },
        quizzItems: true,
        createdBy: true,
      },
    });

    return reply.status(200).send({ message: "ok", quizzes });
  } catch (error) {
    console.log("Error fetching quizzes", error);
    return reply.status(500).send({ message: "Internal server error", error });
  }
}

export async function fetchQuizzHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { id } = request.params as { id: string };

    if (!id) {
      return reply.status(400).send({ message: "Quizz ID not provided" });
    }

    const quizz = await prisma.quizz.findUnique({
      relationLoadStrategy: "query",
      include: {
        chapter: {
          include: {
            module: true,
          },
        },
        quizzItems: true,
        createdBy: true,
      },
      where: {
        id: id,
      },
    });

    if (!quizz) {
      return reply.status(404).send({ message: "Quizz not found" });
    }

    return reply.status(200).send({ message: "ok", quizz });
  } catch (error) {
    console.log("Error fetching quizz", error);
    return reply.status(500).send({ message: "Internal server error", error });
  }
}

export async function fetchQuizzByChapterHandler(
  request: FastifyRequest<{ Params: { chapterId: string } }>,
  reply: FastifyReply
) {
  try {
    const { chapterId } = request.params;

    if (!chapterId) {
      return reply.status(400).send({ message: "Chapter ID not provided" });
    }

    const quizz = await prisma.quizz.findFirst({
      relationLoadStrategy: "query",
      include: {
        chapter: true,
        quizzItems: true,
        createdBy: true,
      },
      where: {
        chapterId,
      },
    });

    if (!quizz) {
      return reply.status(404).send({ message: "Quizz not found" });
    }

    return reply.status(200).send({ message: "ok", quizz });
  } catch (error) {
    console.log("Error fetching quizz", error);
    return reply.status(500).send({ message: "Internal server error", error });
  }
}

export async function createQuizzHandler(
  request: FastifyRequest<{ Body: z.infer<typeof quizzSchema> }>,
  reply: FastifyReply
) {
  try {
    const { createdById, name, chapterId } = request.body;

    const quizz = await prisma.quizz.create({
      data: {
        name,
        chapterId,
        createdById,
      },
    });

    return reply
      .status(201)
      .send({ message: "Quizz created successfully", quizz });
  } catch (error) {
    console.log("Error fetching quizz", error);
    return reply.status(500).send({ message: "Internal server error", error });
  }
}

export async function updateQuizzHandler(
  request: FastifyRequest<{ Body: z.infer<typeof quizzSchema> }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params as { id: string };

    if (!id) {
      return reply.status(400).send({ message: "Quizz ID not provided" });
    }

    const existingQuizz = await prisma.quizz.findUnique({
      where: {
        id,
      },
    });

    if (!existingQuizz) {
      return reply.status(404).send({ message: "Quizz not found" });
    }

    const { name, chapterId, createdById } = request.body;

    const quizz = await prisma.quizz.update({
      where: {
        id,
      },
      data: {
        name,
        chapterId,
        createdById,
      },
    });

    return reply
      .status(200)
      .send({ message: "Quizz updated successfully", quizz });
  } catch (error) {
    console.log("Error fetching quizz", error);
    return reply.status(500).send({ message: "Internal server error", error });
  }
}

export async function deleteQuizzHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { id } = request.params as { id: string };

    if (!id) {
      return reply.status(400).send({ message: "Quizz ID not provided" });
    }

    const existingQuizz = await prisma.quizz.findUnique({
      where: {
        id,
      },
    });

    if (!existingQuizz) {
      return reply.status(404).send({ message: "Quizz not found" });
    }

    await prisma.quizz.delete({
      where: {
        id: id,
      },
    });

    return reply.status(200).send({ message: "Quizz deleted successfully" });
  } catch (error) {
    console.log("Error deleting quizz", error);
    return reply.status(500).send({ message: "Internal server error", error });
  }
}
