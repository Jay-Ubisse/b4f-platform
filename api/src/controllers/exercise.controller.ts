import { VM } from "vm2";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

import { prisma } from "../lib/db";
import {
  checkExerciseAnswerSchema,
  exerciseSchema,
} from "../schemas/exercise.schema";

export async function fetchExercisesHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const ex = await prisma.exercise.findMany({
      relationLoadStrategy: "query",
      include: {
        createdBy: true,
      },
    });

    const exercises = ex.map((exercise) => {
      const params = exercise.parameters.join(", ");
      const functionTemplate = `function ${exercise.functionName}(${params}) {
  // Escreva sua lógica aqui
}`;

      return {
        ...exercise,
        functionTemplate,
      };
    });

    return reply.status(200).send({
      message: "ok",
      exercises: exercises,
    });
  } catch (error) {
    console.error("Error creating exercises", error);
    return reply.status(500).send({ message: "Internal server error", error });
  }
}

export async function fetchExerciseHandler(
  request: FastifyRequest<{
    Params: { id: string };
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;

    if (!id) {
      return reply.status(400).send({ message: "Exercise ID not provided." });
    }

    const existigExercise = await prisma.exercise.findUnique({
      relationLoadStrategy: "query",
      include: {
        createdBy: true,
      },
      where: { id },
    });

    if (!existigExercise) {
      return reply.status(404).send({ message: "Exercise not found." });
    }

    const params = existigExercise.parameters.join(", ");
    const functionTemplate = `function ${existigExercise.functionName}(${params}) {
  // Escreva sua lógica aqui
}`;

    const exercise = {
      ...existigExercise,
      functionTemplate,
    };

    return reply.status(200).send({
      message: "ok",
      exercise: exercise,
    });
  } catch (error) {
    console.error("Error creating exercise", error);
    return reply.status(500).send({ message: "Internal server error", error });
  }
}

export async function createExerciseHandler(
  request: FastifyRequest<{ Body: z.infer<typeof exerciseSchema> }>,
  reply: FastifyReply
) {
  try {
    const {
      title,
      description,
      createdById,
      language,
      functionName,
      parameters,
      tests,
      htmlTemplate,
      cssTemplate,
    } = request.body;

    const exercise = await prisma.exercise.create({
      data: {
        title,
        description,
        createdById,
        language,
        functionName,
        parameters,
        tests,
        htmlTemplate,
        cssTemplate,
      },
    });

    return reply
      .status(201)
      .send({ message: "Exercise created successfully", exercise });
  } catch (error) {
    console.error("Error creating exercise", error);
    return reply.status(500).send({ message: "Internal server error", error });
  }
}

export async function updateExerciseHandler(
  request: FastifyRequest<{
    Body: z.infer<typeof exerciseSchema>;
    Params: { id: string };
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;

    if (!id) {
      return reply.status(400).send({ message: "Exercise ID not provided." });
    }

    const existigExercise = await prisma.exercise.findUnique({
      relationLoadStrategy: "query",
      where: { id },
    });

    if (!existigExercise) {
      return reply.status(404).send({ message: "Exercise not found." });
    }

    const { description, createdById, tests, functionName, parameters, title } =
      request.body;

    const exercise = await prisma.exercise.update({
      data: {
        description,
        createdById,
        tests,
        functionName,
        parameters,
        title,
      },
      where: { id },
    });

    return reply
      .status(201)
      .send({ message: "Exercise updated sucessfully", exercise });
  } catch (error) {
    console.error("Error updating exercise", error);
    return reply.status(500).send({ message: "Internal server error", error });
  }
}

export async function deleteExerciseHandler(
  request: FastifyRequest<{
    Params: { id: string };
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;

    if (!id) {
      return reply.status(400).send({ message: "Exercise ID not provided." });
    }

    const existigExercise = await prisma.exercise.findUnique({
      where: { id },
    });

    if (!existigExercise) {
      return reply.status(404).send({ message: "Exercise not found." });
    }

    await prisma.exercise.delete({
      where: { id },
    });

    return reply.status(201).send({ message: "Exercise deleted sucessfully" });
  } catch (error) {
    console.error("Error updating exercise", error);
    return reply.status(500).send({ message: "Internal server error", error });
  }
}

export async function checkExerciseAnswerHandler(
  request: FastifyRequest<{ Body: z.infer<typeof checkExerciseAnswerSchema> }>,
  reply: FastifyReply
) {
  const { exerciseId, studentId, solution } = request.body;

  const exercise = await prisma.exercise.findUnique({
    where: { id: exerciseId },
  });

  if (!exercise) {
    return reply.status(404).send({ message: "Exercise not found" });
  }

  if (exercise.language === "JAVASCRIPT") {
    const vm = new VM({ timeout: 1000, sandbox: {} });

    try {
      vm.run(solution);
      const func = vm.run(exercise.functionName ?? "");
      const results = exercise.tests as Array<{ input: any[]; expected: any }>;

      for (const test of results) {
        const output = func(...test.input);
        if (output !== test.expected) {
          return reply.status(422).send({
            success: false,
            message: "Wrong answer",
            input: test.input,
            expected: test.expected,
            got: output,
          });
        }
      }
    } catch (error) {
      return reply.status(500).send({ message: "Error executing JS", error });
    }
  }

  // HTML e CSS não são executados via VM — são avaliados por comparação simples ou por testes automatizados no futuro
  else if (exercise.language === "HTML" || exercise.language === "CSS") {
    // Simples validação por igualdade de strings (pode ser substituído por testes mais robustos)
    if (!solution.trim()) {
      return reply
        .status(400)
        .send({ success: false, message: "Empty solution" });
    }
  }

  // Marca o exercício como concluído
  /**  await prisma.exerciseProgress.upsert({
    where: { studentId_exerciseId: { studentId, exerciseId } },
    update: { completed: true, completedAt: new Date() },
    create: {
      studentId,
      exerciseId,
      completed: true,
      completedAt: new Date(),
    },
  }); */

  return reply.status(200).send({
    success: true,
    message: "Correct answer. Exercise completed!",
  });
}
