// plugins/jwt.ts
import fp from "fastify-plugin";
import jwt, { FastifyJWT } from "@fastify/jwt";
import { FastifyReply, FastifyRequest } from "fastify";
import "@fastify/jwt";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { id: string; email: string; role: string }; // tipo do payload usado ao assinar
    user: {
      id: string;
      email: string;
      role: string;
    }; // tipo do `request.user`
  }
}

export default fp(async (fastify) => {
  fastify.register(jwt, {
    secret: process.env.JWT_SECRET || "super-secret",
  });

  // Decorador de autenticação com Authorization: Bearer
  fastify.decorate(
    "authenticate",
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        await request.jwtVerify(); // Fastify extrai automaticamente do Authorization header
      } catch (err) {
        reply.code(401).send({ message: "Unauthorized" });
      }
    }
  );
});

// Extensões de tipos do Fastify
declare module "fastify" {
  interface FastifyInstance {
    authenticate: any;
  }

  interface FastifyRequest {
    user: {
      id: string;
      email: string;
      role: string;
    };
  }
}
