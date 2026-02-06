import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../lib/db";
import z from "zod";
import { chapterSchema } from "../schemas/chapter.schema";

export async function fetchChaptersHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const chapters = await prisma.chapter.findMany({
      relationLoadStrategy: "query",
      include: {
        module: true,
        quizzes: true,
        createdBy: true,
      },
    });

    return reply.status(200).send({ message: "ok", chapters });
  } catch (error) {
    console.log("Error fetching chapters", error);
    return reply.status(400).send({ message: "Internal server error" });
  }
}

export async function fetchChapterHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { chapterId } = request.params as { chapterId: string };

    if (!chapterId) {
      return reply.status(400).send({ message: "Chapter ID not provided" });
    }

    const chapter = await prisma.chapter.findUnique({
      relationLoadStrategy: "query",
      include: {
        module: true,
        quizzes: true,
        createdBy: true,
      },
      where: {
        id: chapterId,
      },
    });

    return reply.status(200).send({ message: "ok", chapter });
  } catch (error) {
    console.log("Error fetching chapter", error);
    return reply.status(400).send({ message: "Internal server error" });
  }
}

export async function createChapterHanlder(
  request: FastifyRequest<{ Body: z.infer<typeof chapterSchema> }>,
  reply: FastifyReply
) {
  try {
    const { createdById, name, bannerUrl, content, moduleId, videoUrl } =
      request.body;

    const chapter = await prisma.$transaction(
      async (tx) => {
        const chapter = await tx.chapter.create({
          data: {
            name,
            createdById,
            bannerUrl,
            content,
            moduleId,
            videoUrl,
          },
          include: {
            module: true,
          },
        });

        /* await tx.course.update({
          where: {
            id: chapter.module.courseId,
          },
          data: {
            modulesNumber: {
              increment: 1,
            },
          },
        }); */

        return chapter;
      },
      {
        timeout: 30000,
      }
    );

    return reply
      .status(201)
      .send({ message: "Chapter created successfully", chapter });
  } catch (error) {
    console.log("Error fetching chapter", error);
    return reply.status(400).send({ message: "Internal server error" });
  }
}

export async function updateChapterHanlder(
  request: FastifyRequest<{ Body: z.infer<typeof chapterSchema> }>,
  reply: FastifyReply
) {
  try {
    const { chapterId } = request.params as { chapterId: string };

    if (!chapterId) {
      return reply.status(400).send({ message: "Chapter ID not provided" });
    }

    const { createdById, name, bannerUrl, content, moduleId, videoUrl } =
      request.body;

    const chapter = await prisma.chapter.update({
      data: {
        name,
        createdById,
        bannerUrl,
        content,
        moduleId,
        videoUrl,
      },
      where: {
        id: chapterId,
      },
    });

    return reply
      .status(200)
      .send({ message: "Chapter updated successfully", chapter });
  } catch (error) {
    console.log("Error updating chapter", error);
    return reply.status(400).send({ message: "Internal server error" });
  }
}

export async function deleteChapterHandler(
  request: FastifyRequest<{ Body: z.infer<typeof chapterSchema> }>,
  reply: FastifyReply
) {
  try {
    const { chapterId } = request.params as { chapterId: string };

    if (!chapterId) {
      return reply.status(400).send({ message: "Chapter ID not provided" });
    }

    const chapter = await prisma.$transaction(
      async (tx) => {
        const chapter = await prisma.chapter.delete({
          where: {
            id: chapterId,
          },
          include: {
            module: true,
          },
        });

        await tx.module.update({
          where: {
            id: chapter.moduleId,
          },
          data: {
            chaptersNumber: {
              decrement: 1,
            },
          },
        });
      },
      {
        timeout: 20000,
      }
    );

    return reply
      .status(200)
      .send({ message: "Chapter deleted successfully", chapter });
  } catch (error) {
    console.log("Error deleting chapter", error);
    return reply.status(400).send({ message: "Internal server error" });
  }
}
