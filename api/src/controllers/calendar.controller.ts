import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { prisma } from "../lib/db";
import { calendarSchema } from "../schemas/calendar.schema";

export async function fetchCalendarByEditionHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { editionId } = request.params as { editionId: string };

    const calendar = await prisma.calendar.findUnique({
      where: {
        editionId,
      },
    });

    if (!calendar) {
      return reply.status(404).send({ message: "No caledar found." });
    }

    return reply.status(200).send({
      message: "ok",
      calendar: {
        id: calendar.id,
        calendarUrl: calendar.calendarUrl,
        editionId: calendar.editionId,
        createdAt: calendar.createdAt.toISOString(),
        updatedAt: calendar.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error fetching calendar:", error);
    return reply.status(500).send({ message: "Internal server error" });
  }
}

export async function publishCalendarHandler(
  request: FastifyRequest<{ Body: z.infer<typeof calendarSchema> }>,
  reply: FastifyReply
) {
  try {
    const { calendarUrl, editionId } = request.body;

    const existingCalendar = await prisma.calendar.findFirst({
      where: {
        editionId,
      },
    });

    if (existingCalendar) {
      return reply
        .status(400)
        .send({ message: "There is already a calendar in this edition" });
    }

    const calendar = await prisma.calendar.create({
      data: {
        calendarUrl,
        editionId,
      },
    });

    return reply.status(201).send({
      message: "Calendar created successfully",
      calendar: {
        id: calendar.id,
        calendarUrl: calendar.calendarUrl,
        editionId: calendar.editionId,
        createdAt: calendar.createdAt.toISOString(),
        updatedAt: calendar.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error creating calendar:", error);
    return reply.status(500).send({ message: "Internal server error" });
  }
}
