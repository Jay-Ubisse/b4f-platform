import { FastifyTypedInstance } from "../types/zod";
import { loginHandler } from "../controllers/user.controller";
import z from "zod";

export async function authRoutes(app: FastifyTypedInstance) {
  app.post(
    "/login",
    {
      schema: {
        tags: ["users"],
        description: "User login",
        body: z.object({
          email: z.string().email(),
          password: z.string(),
        }),
        response: {
          200: z
            .object({
              message: z.string().describe("Success message"),
              token: z.string().describe("JWT token"),
              user: z.object({
                id: z.string(),
                email: z.string().email(),
                role: z.string(),
              }),
            })
            .describe("Login successful"),
          401: z.object({ message: z.string() }).describe("Unauthorized"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    loginHandler
  );
}
