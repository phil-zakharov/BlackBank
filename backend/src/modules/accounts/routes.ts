import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { z } from "zod";
import { prisma } from "../../config/prisma";
import { requireAuth } from "../../middleware/auth";

const createAccountBodySchema = z.object({
  currency: z.string().default("RUB"),
});

export async function registerAccountRoutes(
  app: FastifyInstance,
  _opts: FastifyPluginOptions,
) {
  app.get("/", {
    preHandler: requireAuth,
    schema: {
      tags: ["Accounts"],
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              accountNumber: { type: "string" },
              currency: { type: "string" },
              balance: { type: "number" },
              status: { type: "string" },
            },
          },
        },
        401: {
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
      },
    },
  }, async (request, reply) => {
    const userId = (request as any).userId as string;
    const accounts = await prisma.account.findMany({
      where: { userId },
    });
    return reply.send(
      accounts.map((a: any) => ({
        id: a.id,
        accountNumber: a.accountNumber,
        currency: a.currency,
        balance: Number(a.balance),
        status: a.status,
      })),
    );
  });

  app.post("/", {
    preHandler: requireAuth,
    schema: {
      tags: ["Accounts"],
      security: [{ bearerAuth: [] }],
      body: {
        type: "object",
        properties: {
          currency: { type: "string" },
        },
      },
      response: {
        201: {
          type: "object",
          properties: {
            id: { type: "string" },
            accountNumber: { type: "string" },
            currency: { type: "string" },
            balance: { type: "number" },
            status: { type: "string" },
          },
        },
        400: {
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
        401: {
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
      },
    },
  }, async (request, reply) => {
    const parsed = createAccountBodySchema.safeParse(request.body ?? {});
    if (!parsed.success) {
      return reply.code(400).send({ error: "Invalid body" });
    }
    const { currency } = parsed.data;
    const userId = (request as any).userId as string;

    const accountNumber = `BB${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const account = await prisma.account.create({
      data: {
        userId,
        accountNumber,
        currency,
        balance: 0,
      },
    });

    return reply.code(201).send({
      id: account.id,
      accountNumber: account.accountNumber,
      currency: account.currency,
      balance: Number(account.balance),
      status: account.status,
    });
  });

  app.delete("/:id", {
    preHandler: requireAuth,
    schema: {
      tags: ["Accounts"],
      security: [{ bearerAuth: [] }],
      params: {
        type: "object",
        properties: {
          id: { type: "string" },
        },
        required: ["id"],
      },
      response: {
        200: {
          type: "object",
          properties: {
            id: { type: "string" },
            status: { type: "string" },
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
    const { id } = request.params as { id: string };

    const account = await prisma.account.findFirst({
      where: { id, userId },
    });
    if (!account) {
      return reply.code(404).send({ error: "Account not found" });
    }

    const updated = await prisma.account.update({
      where: { id },
      data: { status: "CLOSED" },
    });

    return reply.send({ id: updated.id, status: updated.status });
  });

  app.get("/:id/balance", {
    preHandler: requireAuth,
    schema: {
      tags: ["Accounts"],
      security: [{ bearerAuth: [] }],
      params: {
        type: "object",
        properties: {
          id: { type: "string" },
        },
        required: ["id"],
      },
      response: {
        200: {
          type: "object",
          properties: {
            id: { type: "string" },
            balance: { type: "number" },
            currency: { type: "string" },
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
    const { id } = request.params as { id: string };

    const account = await prisma.account.findFirst({
      where: { id, userId },
    });
    if (!account) {
      return reply.code(404).send({ error: "Account not found" });
    }

    return reply.send({
      id: account.id,
      balance: Number(account.balance),
      currency: account.currency,
    });
  });
}

