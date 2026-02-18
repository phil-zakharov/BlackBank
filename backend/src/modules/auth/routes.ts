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

    const isProd = process.env.NODE_ENV === "production";

    reply.setCookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/auth/refresh",
      maxAge: 7 * 24 * 60 * 60,
    });

    return reply.send({ accessToken });
  });

  app.post("/refresh", {
    schema: {
      tags: ["Auth"],
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
    const { refreshToken } = (request.cookies as any) ?? {};
    if (!refreshToken || typeof refreshToken !== "string") {
      return reply.code(401).send({ error: "Refresh token missing" });
    }

    try {
      const decoded = app.jwt.verify(refreshToken) as { sub: string; type?: string };
      if (decoded.type !== "refresh") {
        return reply.code(400).send({ error: "Invalid token type" });
      }

      const stored = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
      });
      if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
        reply.clearCookie("refreshToken", { path: "/auth/refresh" });
        return reply.code(401).send({ error: "Refresh token invalid" });
      }

      const accessToken = app.jwt.sign(
        { sub: decoded.sub },
        { expiresIn: "15m" },
      );

      return reply.send({ accessToken });
    } catch {
      reply.clearCookie("refreshToken", { path: "/auth/refresh" });
      return reply.code(401).send({ error: "Invalid token" });
    }
  });
}

