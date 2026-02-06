import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { classSchema } from "../schemas/class.schema";
import { prisma } from "../lib/db";
import { Prisma } from "../generated/prisma";

export async function createClassHandler(
  request: FastifyRequest<{ Body: z.infer<typeof classSchema> }>,
  reply: FastifyReply,
) {
  try {
    const { capacity, editionId, shift } = request.body;

    const existingClass = await prisma.class.findFirst({
      where: {
        shift,
        editionId,
      },
    });

    if (existingClass) {
      return reply.status(409).send({
        message:
          "There is already a class with the same shift in this edition.",
      });
    }

    const class_ = await prisma.class.create({
      data: {
        capacity,
        shift,
        editionId,
      },
    });

    return reply.status(201).send({
      message: "Class created successfully",
      class_,
    });
  } catch (error) {
    /**    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return reply.status(400).send({
        message: "Já existe uma turma com o mesmo turno nesta edição.",
      });
    } */

    console.error("Error creating class:", error);
    return reply.status(500).send({ message: "Internal server error" });
  }
}

export async function fecthClassesHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const classes = await prisma.class.findMany({
      relationLoadStrategy: "query",
      include: {
        edition: {
          include: {
            country: true,
            location: true,
            course: true,
          },
        },
        students: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return reply.status(200).send({ message: "ok", classes });
  } catch (error) {
    console.error("Error fetching classes:", error);
    return reply.status(500).send({ message: "Internal server error" });
  }
}

export async function fecthClassHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const { id } = request.params;

  if (!id) {
    return reply.status(400).send({ message: "Class ID not provided" });
  }

  try {
    const class_ = await prisma.class.findUnique({
      relationLoadStrategy: "query",
      include: {
        edition: {
          include: {
            country: true,
            location: true,
            course: true,
          },
        },
        students: true,
      },
      where: {
        id,
      },
    });

    if (!class_) {
      return reply.status(400).send({ message: "Class not found" });
    }

    return reply.status(200).send({ message: "ok", class_ });
  } catch (error) {
    console.error("Error fetching classes:", error);
    return reply.status(500).send({ message: "Internal server error" });
  }
}

export async function fetchClassesByEditionHandler(
  request: FastifyRequest<{ Params: { editionId: string } }>,
  reply: FastifyReply,
) {
  try {
    const { editionId } = request.params;

    if (!editionId) {
      return reply.status(400).send({ message: "Edition ID not provided" });
    }

    const classes = await prisma.class.findMany({
      relationLoadStrategy: "query",
      include: {
        edition: {
          include: {
            country: true,
            location: true,
            course: true,
          },
        },
        students: true,
      },
      orderBy: {
        createdAt: "asc",
      },
      where: {
        editionId,
      },
    });

    return reply.status(200).send({ message: "ok", classes });
  } catch (error) {
    console.log("Error fetching classes:", error);
    return reply.status(500).send({ message: "Internal server error" });
  }
}

export async function deleteClassHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  try {
    const { id } = request.params;

    if (!id) {
      return reply.status(400).send({ message: "Class ID not provided" });
    }

    const class_ = await prisma.class.findUnique({
      where: {
        id,
      },
    });

    if (!class_) {
      return reply.status(404).send({ message: "Class not found" });
    }

    await prisma.class.delete({
      where: {
        id,
      },
    });

    return reply.status(200).send({ message: "Class deleted successfully" });
  } catch (error) {
    console.log("Error deleting class", error);
    return reply.status(500).send({ message: "Internal server error", error });
  }
}
