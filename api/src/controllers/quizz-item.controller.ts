import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../lib/db";
import z from "zod";
import {
  checkQuizzAnswerSchema,
  quizzItemSchema,
} from "../schemas/quizz.schema";

export async function fetchQuizzItemHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { id } = request.params as { id: string };

    if (!id) {
      return reply.status(400).send({ message: "Quizz item ID not provided" });
    }

    const existingQuizzItems = await prisma.quizzItem.findUnique({
      where: {
        id,
      },
    });

    if (!existingQuizzItems) {
      return reply.status(404).send({ message: "Quizz item not found" });
    }

    const quizzItem = await prisma.quizzItem.findUnique({
      relationLoadStrategy: "query",
      include: {
        quizz: true,
      },
      where: {
        id: id,
      },
    });

    return reply.status(200).send({ message: "ok", quizzItem });
  } catch (error) {
    console.log("Error fetching quizz", error);
    return reply.status(500).send({ message: "Internal server error", error });
  }
}

export async function fetchQuizzItemsHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { quizzId } = request.params as { quizzId: string };

    if (!quizzId) {
      return reply.status(400).send({ message: "Quizz ID not provided" });
    }

    const existingQuizz = await prisma.quizz.findUnique({
      where: {
        id: quizzId,
      },
    });

    if (!existingQuizz) {
      return reply.status(404).send({ message: "Quizz not found." });
    }

    const quizzItems = await prisma.quizzItem.findMany({
      relationLoadStrategy: "query",
      include: {
        quizz: true,
      },
      where: {
        quizzId,
      },
    });

    return reply.status(200).send({ message: "ok", quizzItems });
  } catch (error) {
    console.log("Error fetching quizzes", error);
    return reply.status(500).send({ message: "Internal server error", error });
  }
}

export async function createQuizzItemHandler(
  request: FastifyRequest<{ Body: z.infer<typeof quizzItemSchema> }>,
  reply: FastifyReply
) {
  try {
    const { answer, option1, option2, question, quizzId, option3, option4 } =
      request.body;

    const quizzItem = await prisma.quizzItem.create({
      data: {
        answer,
        option1,
        option2,
        question,
        quizzId,
        option3,
        option4,
      },
    });

    return reply
      .status(201)
      .send({ message: "Quizz Item created successfully", quizzItem });
  } catch (error) {
    console.log("Error fetching quizz", error);
    return reply.status(500).send({ message: "Internal server error", error });
  }
}

export async function updateQuizzItemHandler(
  request: FastifyRequest<{ Body: z.infer<typeof quizzItemSchema> }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params as { id: string };

    if (!id) {
      return reply.status(400).send({ message: "Quizz item ID not provided" });
    }

    const existingQuizzItem = await prisma.quizzItem.findUnique({
      where: {
        id,
      },
    });

    if (!existingQuizzItem) {
      return reply.status(404).send({ message: "Quizz item not found" });
    }

    const { answer, option1, option2, question, quizzId, option3, option4 } =
      request.body;

    const quizzItem = await prisma.quizzItem.update({
      where: {
        id,
      },
      data: {
        answer,
        option1,
        option2,
        question,
        quizzId,
        option3,
        option4,
      },
    });

    return reply
      .status(200)
      .send({ message: "Quizz item updated successfully", quizzItem });
  } catch (error) {
    console.log("Error fetching quizz", error);
    return reply.status(500).send({ message: "Internal server error", error });
  }
}

export async function deleteQuizzItemHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { id } = request.params as { id: string };

    if (!id) {
      return reply.status(400).send({ message: "Quizz item ID not provided" });
    }

    const existingQuizzItem = await prisma.quizzItem.findUnique({
      where: {
        id,
      },
    });

    if (!existingQuizzItem) {
      return reply.status(404).send({ message: "Quizz item not found" });
    }

    await prisma.quizzItem.delete({
      where: {
        id: id,
      },
    });

    return reply
      .status(200)
      .send({ message: "Quizz item deleted successfully" });
  } catch (error) {
    console.log("Error deleting quizz", error);
    return reply.status(500).send({ message: "Internal server error", error });
  }
}

export async function checkQuizzItemAnswer(
  request: FastifyRequest<{ Body: z.infer<typeof checkQuizzAnswerSchema> }>,
  reply: FastifyReply
) {
  try {
    const { quizzItemId, studentAnswer } = request.body;

    const quizzItem = await prisma.quizzItem.findUnique({
      where: {
        id: quizzItemId,
      },
    });

    if (!quizzItem) {
      return reply.status(404).send({ message: "Quizz item not found." });
    }

    if (studentAnswer !== quizzItem.answer) {
      return reply.status(422).send({ message: "Wrong answer." });
    }

    return reply.status(200).send({ message: "Correct answer." });
  } catch (error) {
    console.log("Error checking answer", error);
    return reply.status(500).send({ message: "Internal server error", error });
  }
}
