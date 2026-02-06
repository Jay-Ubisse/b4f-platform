import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../lib/db";
import z from "zod";
import {
  createEditionSchema,
  updateEditionSchema,
} from "../schemas/edition.schema";

export async function fetchEditionsHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const editions = await prisma.edition.findMany({
      relationLoadStrategy: "query",
      include: {
        course: true,
        country: true,
        location: true,
        attendance: true,
        calendar: true,
        classes: true,
        students: true,
        candidates: true,
        interviews: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return reply.status(200).send({
      message: "ok",
      editions,
    });
  } catch (error) {
    console.error("Ocorreu um erro ao buscar edições:", error);
    return reply.status(500).send({ message: "Erro interno no servidor" });
  }
}

export async function createEditionHandler(
  request: FastifyRequest<{ Body: z.infer<typeof createEditionSchema> }>,
  reply: FastifyReply,
) {
  const {
    name,
    number,
    year,
    courseId,
    interviewBookingUrl,
    countryId,
    locationId,
  } = request.body;

  const existingEdition = await prisma.edition.findFirst({
    where: {
      name,
      locationId,
      courseId,
      number,
    },
  });

  if (existingEdition) {
    return reply.status(409).send({
      message:
        "Já existe uma edição com o mesmo nome, na mesma cidade e no mesmo curso.",
    });
  }

  try {
    const edition = await prisma.edition.create({
      data: {
        locationId,
        interviewBookingUrl,
        courseId,
        name,
        countryId,
        number,
        year,
      },
    });

    return reply.status(201).send({
      message: "Edição criada com sucesso",
      edition,
    });
  } catch (error) {
    console.error("Ocorreu um erro ao criar edição", error);
    return reply.status(500).send({ message: "Erro interno no servidor" });
  }
}

export async function updateEditionHandler(
  request: FastifyRequest<{
    Params: { id: string };
    Body: z.infer<typeof updateEditionSchema>;
  }>,
  reply: FastifyReply,
) {
  try {
    const { id } = request.params;
    const {
      countryId,
      name,
      number,
      courseId,
      year,
      locationId,
      applicationsStatus,
      lessonsStatus,
    } = request.body;

    if (!id) {
      return reply.status(400).send({ message: "ID não fornecido" });
    }

    const existingEdition = await prisma.edition.findUnique({
      where: {
        id,
      },
    });

    if (!existingEdition) {
      return reply.status(404).send({ message: "Edição não encontrada" });
    }

    const edition = await prisma.edition.update({
      data: {
        name,
        locationId,
        courseId,
        countryId,
        number,
        year,
        applicationsStatus,
        lessonsStatus,
      },
      where: {
        id,
      },
    });

    return reply
      .status(200)
      .send({ message: "Edição actualizada com sucesso", edition });
  } catch (error) {
    console.error("Ocorreu um erro ao eliminar edição", error);
    return reply.status(500).send({ message: "Erro interno no servidor" });
  }
}

export async function updateEditionInterviewBookingUrlHandler(
  request: FastifyRequest<{
    Params: { editionId: string };
    Body: { interviewBookingUrl: string };
  }>,
  reply: FastifyReply,
) {
  try {
    const { editionId } = request.params;
    const { interviewBookingUrl } = request.body;

    if (!editionId) {
      return reply.status(400).send({ message: "ID da edição não fornecido" });
    }

    const existingEdition = await prisma.edition.findUnique({
      where: {
        id: editionId,
      },
    });

    if (!existingEdition) {
      return reply.status(404).send({ message: "Edição não encontrada" });
    }

    const edition = await prisma.edition.update({
      data: {
        interviewBookingUrl,
      },
      where: {
        id: editionId,
      },
    });

    return reply.status(200).send({
      message: "URL de marcação de entrevistas actualizada com sucesso",
      edition,
    });
  } catch (error) {
    console.error(
      "Ocorreu um erro ao actualizar o URL de marcação de entrevistas",
      error,
    );
    return reply.status(500).send({ message: "Erro interno no servidor" });
  }
}

export async function deleteEditionHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  try {
    const { id } = request.params;

    if (!id) {
      return reply.status(400).send({ message: "ID não fornecido" });
    }

    const edition = await prisma.edition.findUnique({
      where: {
        id,
      },
    });

    if (!edition) {
      return reply.status(404).send({ message: "Edição não encontrada" });
    }

    await prisma.edition.delete({
      where: {
        id,
      },
    });

    return reply.status(200).send({ message: "Edição eliminada com sucesso" });
  } catch (error) {
    console.error("Ocorreu um erro ao eliminar edição", error);
    return reply.status(500).send({ message: "Erro interno no servidor" });
  }
}
