import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../lib/db";
import z from "zod";
import {
  creeateCountrySchema,
  updateCountrySchema,
} from "../schemas/country.schema";

export async function fetchAllCountriesHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const countries = await prisma.country.findMany({
      relationLoadStrategy: "query",
      include: {
        locations: true,
      },
    });

    return reply.status(200).send({ message: "ok", countries });
  } catch (error) {
    console.error("Error fetching countries", error);
    return reply.status(500).send({ message: "Internal server error", error });
  }
}

export async function fetchCountryByIdHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  try {
    const { id } = request.params;

    if (!id) {
      return reply.status(400).send({ message: "Country ID not provided" });
    }

    const country = await prisma.country.findUnique({
      relationLoadStrategy: "query",
      where: {
        id,
      },
      include: {
        locations: true,
      },
    });

    if (!country) {
      return reply.status(404).send({ message: "Country not found" });
    }

    return reply.status(200).send({ message: "ok", country });
  } catch (error) {
    console.error("Error fetching country", error);
    return reply.status(500).send({ message: "Internal server error", error });
  }
}

export async function createCountryHandler(
  request: FastifyRequest<{ Body: z.infer<typeof creeateCountrySchema> }>,
  reply: FastifyReply,
) {
  try {
    const { name } = request.body;

    const existingCountry = await prisma.country.findFirst({
      where: {
        name,
      },
    });

    if (existingCountry) {
      return reply
        .status(409)
        .send({ message: "There is already a country with the same name." });
    }

    const country = await prisma.country.create({
      data: {
        name,
      },
    });

    return reply
      .status(201)
      .send({ message: "Country created successfully", country });
  } catch (error) {
    console.error("Error creating country", error);
    return reply.status(500).send({ message: "Internal server error", error });
  }
}

export async function updateCountryHandler(
  request: FastifyRequest<{
    Params: { id: string };
    Body: z.infer<typeof updateCountrySchema>;
  }>,
  reply: FastifyReply,
) {
  try {
    const { id } = request.params;
    const { name } = request.body;

    if (!id) {
      return reply.status(400).send({ message: "Country ID not provided" });
    }

    const existingCountry = await prisma.country.findUnique({
      where: {
        id,
      },
    });

    if (!existingCountry) {
      return reply.status(404).send({ message: "Country not found" });
    }

    const existingCountryName = await prisma.country.findFirst({
      where: {
        name,
      },
    });

    if (existingCountryName) {
      return reply
        .status(409)
        .send({ message: "There is already a country with the same name." });
    }

    const country = await prisma.country.update({
      data: { name },
      where: {
        id,
      },
    });

    return reply
      .status(200)
      .send({ message: "Country updated successfully", country });
  } catch (error) {
    console.error("Error updating country", error);
    return reply.status(500).send({ message: "Internal server error", error });
  }
}

export async function deleteCountryHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  try {
    const { id } = request.params;

    if (!id) {
      return reply.status(400).send({ message: "Country ID not provided" });
    }

    const country = await prisma.country.findUnique({
      where: {
        id,
      },
    });

    if (!country) {
      return reply.status(404).send({ message: "Country not found" });
    }

    await prisma.country.delete({
      where: {
        id,
      },
    });

    return reply.status(200).send({ message: "Country deleted successfully" });
  } catch (error) {
    console.error("Error deleting country", error);
    return reply.status(500).send({ message: "Internal server error", error });
  }
}
