import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { z } from "zod";
import bcrypt from "bcrypt";
import { prisma } from "../../config/prisma";

const registerBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(1),
});

const loginBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const refreshBodySchema = z.object({
  refreshToken: z.string().min(1),
});

export async function registerAuthRoutes(
  app: FastifyInstance,
  _opts: FastifyPluginOptions,
) {
  app.post("/register", {
    schema: {
      tags: ["Auth"],
      body: {
        type: "object",
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 6 },
          fullName: { type: "string" },
        },
        required: ["email", "password", "fullName"],
      },
      response: {
        201: {
          type: "object",
          properties: {
            id: { type: "string" },
            email: { type: "string" },
            fullName: { type: "string" },
          },
        },
        400: {
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
        409: {
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
      },
    },
  }, async (request, reply) => {
    const parsed = registerBodySchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: "Invalid body" });
    }
    const { email, password, fullName } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return reply.code(409).send({ error: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, passwordHash, fullName },
    });

    return reply.code(201).send({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
    });
  });

  app.post("/login", {
    schema: {
      tags: ["Auth"],
      body: {
        type: "object",
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 6 },
        },
        required: ["email", "password"],
      },
      response: {
        200: {
          type: "object",
          properties: {
            accessToken: { type: "string" },
            refreshToken: { type: "string" },
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
    const parsed = loginBodySchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: "Invalid body" });
    }
    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return reply.code(401).send({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return reply.code(401).send({ error: "Invalid credentials" });
    }

    const accessToken = app.jwt.sign(
      { sub: user.id },
      { expiresIn: "15m" },
    );
    const refreshToken = app.jwt.sign(
      { sub: user.id, type: "refresh" },
      { expiresIn: "7d" },
    );

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return reply.send({ accessToken, refreshToken });
  });

  app.post("/refresh", {
    schema: {
      tags: ["Auth"],
      body: {
        type: "object",
        properties: {
          refreshToken: { type: "string" },
        },
        required: ["refreshToken"],
      },
      response: {
        200: {
          type: "object",
          properties: {
            accessToken: { type: "string" },
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
    const parsed = refreshBodySchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: "Invalid body" });
    }
    const { refreshToken } = parsed.data;

    try {
      const decoded = app.jwt.verify(refreshToken) as { sub: string; type?: string };
      if (decoded.type !== "refresh") {
        return reply.code(400).send({ error: "Invalid token type" });
      }

      const stored = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
      });
      if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
        return reply.code(401).send({ error: "Refresh token invalid" });
      }

      const accessToken = app.jwt.sign(
        { sub: decoded.sub },
        { expiresIn: "15m" },
      );

      return reply.send({ accessToken });
    } catch {
      return reply.code(401).send({ error: "Invalid token" });
    }
  });
}

