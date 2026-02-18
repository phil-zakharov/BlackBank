import "@fastify/jwt";
import "fastify";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      sub: string;
      type?: string;
    };
    user: {
      sub: string;
      type?: string;
    };
  }
}

declare module "fastify" {
  interface FastifyRequest {
    userId?: string;
  }
}

