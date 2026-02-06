import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../lib/db";
import z from "zod";
import { moduleSchema } from "../schemas/module.schema";

export async function fetchModulesHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const modules = await prisma.module.findMany({
      relationLoadStrategy: "query",
      include: {
        chapters: true,
        createdBy: true,
      },
    });

    return reply.status(200).send({ message: "ok", modules });
  } catch (error) {
    console.log("Error fetching modules", error);
    return reply.status(400).send({ message: "Internal server error" });
  }
}

export async function fetchModuleHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { moduleId } = request.params as { moduleId: string };

    if (!moduleId) {
      return reply.status(400).send({ message: "Module ID not provided" });
    }

    const module = await prisma.module.findUnique({
      relationLoadStrategy: "query",
      include: {
        chapters: true,
        createdBy: true,
      },
      where: {
        id: moduleId,
      },
    });

    return reply.status(200).send({ message: "ok", module });
  } catch (error) {
    console.log("Error fetching module", error);
    return reply.status(400).send({ message: "Internal server error" });
  }
}

export async function createModuleHanlder(
  request: FastifyRequest<{ Body: z.infer<typeof moduleSchema> }>,
  reply: FastifyReply
) {
  try {
    const { createdById, name, bannerUrl } = request.body;

    const module = await prisma.module.create({
      data: {
        name,
        createdById,
        bannerUrl,
      },
    });

    return reply
      .status(201)
      .send({ message: "Module created successfully", module });
  } catch (error) {
    console.log("Error fetching module", error);
    return reply.status(400).send({ message: "Internal server error" });
  }
}

export async function updateModuleHanlder(
  request: FastifyRequest<{ Body: z.infer<typeof moduleSchema> }>,
  reply: FastifyReply
) {
  try {
    const { moduleId } = request.params as { moduleId: string };

    if (!moduleId) {
      return reply.status(400).send({ message: "Module ID not provided" });
    }

    const { createdById, name, bannerUrl } = request.body;

    const module = await prisma.module.update({
      data: {
        name,
        createdById,
        bannerUrl,
      },
      where: {
        id: moduleId,
      },
    });

    return reply
      .status(200)
      .send({ message: "Module updated successfully", module });
  } catch (error) {
    console.log("Error updating module", error);
    return reply.status(400).send({ message: "Internal server error" });
  }
}

export async function deleteModuleHandler(
  request: FastifyRequest<{ Body: z.infer<typeof moduleSchema> }>,
  reply: FastifyReply
) {
  try {
    const { moduleId } = request.params as { moduleId: string };

    if (!moduleId) {
      return reply.status(400).send({ message: "Module ID not provided" });
    }

    const module = await prisma.module.delete({
      where: {
        id: moduleId,
      },
    });

    return reply
      .status(200)
      .send({ message: "Module deleted successfully", module });
  } catch (error) {
    console.log("Error deleting module", error);
    return reply.status(400).send({ message: "Internal server error" });
  }
}
