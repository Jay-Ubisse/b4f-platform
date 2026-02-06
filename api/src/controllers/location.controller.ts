import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../lib/db";
import z from "zod";
import {
  creeateCountrySchema,
  updateCountrySchema,
} from "../schemas/country.schema";
import {
  createLocationSchema,
  updateLocationSchema,
} from "../schemas/location.schema";

export async function fetchAllLocationsHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const locations = await prisma.location.findMany({
      relationLoadStrategy: "query",
      include: {
        country: true,
      },
    });

    return reply.status(200).send({ message: "ok", locations });
  } catch (error) {
    console.error("Error fetching locations", error);
    return reply.status(500).send({ message: "Internal server error", error });
  }
}

export async function fetchLocationByIdHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  try {
    const { id } = request.params;

    if (!id) {
      return reply.status(400).send({ message: "Location ID not provided" });
    }

    const location = await prisma.location.findUnique({
      relationLoadStrategy: "query",
      where: {
        id,
      },
      include: {
        country: true,
      },
    });

    if (!location) {
      return reply.status(404).send({ message: "Cocation not found" });
    }

    return reply.status(200).send({ message: "ok", location });
  } catch (error) {
    console.error("Error fetching location", error);
    return reply.status(500).send({ message: "Internal server error", error });
  }
}

export async function createLocationHandler(
  request: FastifyRequest<{ Body: z.infer<typeof createLocationSchema> }>,
  reply: FastifyReply,
) {
  try {
    const { name, countryId } = request.body;

    const existingLocation = await prisma.location.findFirst({
      where: {
        name,
        countryId,
      },
    });

    if (existingLocation) {
      return reply.status(409).send({
        message:
          "There is already a location with the same name in this country.",
      });
    }

    const location = await prisma.location.create({
      data: {
        name,
        countryId,
      },
    });

    return reply
      .status(201)
      .send({ message: "location created successfully", location });
  } catch (error) {
    console.error("Error creating location", error);
    return reply.status(500).send({ message: "Internal server error", error });
  }
}

export async function updateLocationHandler(
  request: FastifyRequest<{
    Params: { id: string };
    Body: z.infer<typeof updateLocationSchema>;
  }>,
  reply: FastifyReply,
) {
  try {
    const { id } = request.params;
    const { name, countryId } = request.body;

    if (!id) {
      return reply.status(400).send({ message: "Location ID not provided" });
    }

    const existingLocation = await prisma.location.findUnique({
      where: {
        id,
      },
    });

    if (!existingLocation) {
      return reply.status(404).send({ message: "Location not found" });
    }

    const existingLocationName = await prisma.location.findFirst({
      where: {
        name,
        countryId,
      },
    });

    if (existingLocationName) {
      return reply.status(409).send({
        message:
          "There is already a location with the same name in this country.",
      });
    }

    const location = await prisma.location.update({
      data: { name },
      where: {
        id,
        countryId,
      },
    });

    return reply
      .status(200)
      .send({ message: "Location updated successfully", location });
  } catch (error) {
    console.error("Error updating location", error);
    return reply.status(500).send({ message: "Internal server error", error });
  }
}

export async function deleteLocationHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  try {
    const { id } = request.params;

    if (!id) {
      return reply.status(400).send({ message: "Location ID not provided" });
    }

    const location = await prisma.location.findUnique({
      where: {
        id,
      },
    });

    if (!location) {
      return reply.status(404).send({ message: "Location not found" });
    }

    await prisma.location.delete({
      where: {
        id,
      },
    });

    return reply.status(200).send({ message: "Location deleted successfully" });
  } catch (error) {
    console.error("Error deleting location", error);
    return reply.status(500).send({ message: "Internal server error", error });
  }
}
