import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../lib/db";
import z from "zod";
import {
  createCourseSchema,
  updateCourseSchema,
} from "../schemas/course.schema";
import { isDate } from "date-fns/fp";

export async function fetchCoursesHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const courses = await prisma.course.findMany({
      relationLoadStrategy: "query",
      include: {
        createdBy: true,
        editions: true,
      },
    });

    return reply.status(200).send({ message: "ok", courses });
  } catch (error) {
    console.log("Error fetching courses", error);
    return reply.status(400).send({ message: "Internal server error" });
  }
}

export async function fetchCourseByIdHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  try {
    const { id } = request.params;

    if (!isDate) {
      return reply.status(400).send({ message: "Course ID not provided" });
    }

    const course = await prisma.course.findUnique({
      relationLoadStrategy: "query",
      include: {
        createdBy: true,
        editions: true,
      },
      where: {
        id,
      },
    });

    return reply.status(200).send({ message: "ok", course });
  } catch (error) {
    console.log("Error fetching course", error);
    return reply.status(400).send({ message: "Internal server error" });
  }
}

export async function createCourseHanlder(
  request: FastifyRequest<{ Body: z.infer<typeof createCourseSchema> }>,
  reply: FastifyReply,
) {
  try {
    const { createdById, name, bannerUrl, modality, duration, tags } =
      request.body;

    const course = await prisma.course.create({
      data: {
        modality,
        name,
        duration,
        createdById,
        bannerUrl,
        tags,
      },
    });

    return reply
      .status(201)
      .send({ message: "Course created successfully", course });
  } catch (error) {
    console.log("Error fetching course", error);
    return reply.status(400).send({ message: "Internal server error" });
  }
}

export async function updateCourseHanlder(
  request: FastifyRequest<{
    Params: { id: string };
    Body: z.infer<typeof updateCourseSchema>;
  }>,
  reply: FastifyReply,
) {
  try {
    const { id } = request.params;

    if (!id) {
      return reply.status(400).send({ message: "Course ID not provided" });
    }

    const { createdById, name, bannerUrl, modality, duration, tags } =
      request.body;

    const course = await prisma.course.update({
      data: {
        name,
        modality,
        duration,
        createdById,
        bannerUrl,
        tags,
      },
      where: {
        id,
      },
    });

    return reply
      .status(200)
      .send({ message: "Course updated successfully", course });
  } catch (error) {
    console.log("Error updating course", error);
    return reply.status(400).send({ message: "Internal server error" });
  }
}

export async function deleteCourseHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  try {
    const { id } = request.params;

    if (!id) {
      return reply.status(400).send({ message: "Course ID not provided" });
    }

    const course = await prisma.course.delete({
      where: {
        id,
      },
    });

    return reply
      .status(200)
      .send({ message: "Course deleted successfully", course });
  } catch (error) {
    console.log("Error deleting course", error);
    return reply.status(400).send({ message: "Internal server error" });
  }
}
