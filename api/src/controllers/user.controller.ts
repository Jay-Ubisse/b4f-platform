import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { hash, compare } from "bcrypt";
import { Resend } from "resend";

import { createuUserSchema, loginSchema } from "../schemas/user.schema";
import { prisma } from "../lib/db";
import { UserRegistrationTemplate } from "../email/user-registration";
import { passwordGenerator } from "../lib/password-generator";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function listUsersHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const users = await prisma.user.findMany();

    return reply.status(200).send({ message: "ok", users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
}

export async function fetchAuthenticatedUserHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const userId = request.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return reply.status(404).send({ message: "User not found" });
    }

    return reply.status(200).send({
      message: "ok",
      user,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
}

export async function registerUserHandler(
  request: FastifyRequest<{ Body: z.infer<typeof createuUserSchema> }>,
  reply: FastifyReply,
) {
  try {
    const { email, name, role } = request.body;
    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    });

    if (existingUser) {
      return reply.status(400).send({ message: "User already exists" });
    }

    const password = passwordGenerator({
      passwordLength: 12,
      useLowerCase: true,
      useUpperCase: true,
      useNumbers: true,
      useSymbols: false,
    });

    const hashedPassword = await hash(password, 10);

    const result = await prisma.$transaction(async (tx) => {
      const user =
        role === "TEACHER"
          ? await tx.user.create({
              data: {
                email: normalizedEmail,
                name,
                password: hashedPassword,
                role,
                teacher: {
                  create: {
                    isActive: true,
                  },
                },
              },
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                teacher: { select: { id: true } },
              },
            })
          : await tx.user.create({
              data: {
                email: normalizedEmail,
                name,
                password: hashedPassword,
                role,
              },
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            });

      const { data: emailData, error } = await resend.emails.send({
        from: "Bytes 4 Future <comercial@iabil.co.mz>",
        to: [normalizedEmail],
        subject: "Confirmação de Registro no Dashboard | Bytes 4 Future",
        react: UserRegistrationTemplate({
          name,
          email: normalizedEmail,
          password,
          role,
        }) as React.ReactElement,
      });

      if (error) {
        console.error("Error sending email:", error);
        throw new Error("EMAIL_SEND_FAILED");
      }

      return { user, emailId: emailData?.id };
    });

    return reply.status(201).send({
      message: "User registered successfully",
      user: result.user,
      emailId: result.emailId,
    });
  } catch (error: any) {
    console.error("Error registering user:", error);

    if (error?.message === "EMAIL_SEND_FAILED") {
      return reply
        .status(500)
        .send({ message: "Error sending confirmation email" });
    }

    return reply.status(500).send({ message: "Internal Server Error" });
  }
}

export async function loginHandler(
  request: FastifyRequest<{ Body: z.infer<typeof loginSchema> }>,
  reply: FastifyReply,
) {
  try {
    const { email, password } = request.body;

    const user = await prisma.user.findUnique({
      where: { email: email.toLocaleLowerCase().trim() },
    });

    if (!user || !(await compare(password, user.password))) {
      return reply.status(401).send({ message: "Invalid credentials" });
    }

    const token = await reply.jwtSign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      {
        expiresIn: "1d",
      },
    );

    return reply.status(200).send({ message: "ok", token, user });
  } catch (error) {
    console.error("Error during login:", error);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
}

export async function deleteUserHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  try {
    const { id } = request.params;

    if (!id) {
      return reply.status(400).send({ message: "User ID not provided" });
    }

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return reply.status(404).send({ message: "user not found" });
    }

    await prisma.$transaction(
      async (tx) => {
        if (user.role === "STUDENT") {
          await prisma.student.delete({
            where: {
              email: user.email,
            },
          });
        }

        await prisma.user.delete({
          where: {
            id,
          },
        });
      },
      { timeout: 20000 },
    );

    return reply.status(200).send({ message: "User deleted successfully" });
  } catch (error) {
    console.log("Error deleting user", error);
    return reply.status(500).send({ message: "Internal server error", error });
  }
}
