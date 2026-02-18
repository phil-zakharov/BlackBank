import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { prisma } from "../../config/prisma";
import { requireAuth } from "../../middleware/auth";

export async function registerUserRoutes(
  app: FastifyInstance,
  _opts: FastifyPluginOptions,
) {
  app.get("/me", {
    preHandler: requireAuth,
    schema: {
      tags: ["Users"],
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          type: "object",
          properties: {
            id: { type: "string" },
            email: { type: "string" },
            fullName: { type: "string" },
          },
        },
        401: {
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
        404: {
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
      },
    },
  }, async (request, reply) => {
    const userId = (request as any).userId as string;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return reply.code(404).send({ error: "User not found" });
    }

    return reply.send({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
    });
  });
}

