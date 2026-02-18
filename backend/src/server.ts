import Fastify, { FastifyInstance } from "fastify";
import dotenv from "dotenv";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import jwt from "@fastify/jwt";
import cookie from "@fastify/cookie";
import { registerAuthRoutes } from "./modules/auth/routes";
import { registerUserRoutes } from "./modules/users/routes";
import { registerAccountRoutes } from "./modules/accounts/routes";

dotenv.config();

export function buildApp(): FastifyInstance {
  const app = Fastify({
    logger: true,
  });

  app.register(swagger, {
    openapi: {
      info: {
        title: "BlackBank API",
        version: "1.0.0",
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [{ bearerAuth: [] }],
    },
  });

  app.register(swaggerUi, {
    routePrefix: "/docs",
  });

  app.register(cookie, {
    hook: "onRequest",
  });

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    app.log.warn("JWT_SECRET is not set. JWT auth will not work correctly.");
  }

  app.register(jwt, {
    secret: jwtSecret || "development-secret",
  });

  app.get("/health", async () => {
    return { status: "ok" };
  });

  app.register(registerAuthRoutes, { prefix: "/auth" });
  app.register(registerUserRoutes, { prefix: "/users" });
  app.register(registerAccountRoutes, { prefix: "/accounts" });

  return app;
}

