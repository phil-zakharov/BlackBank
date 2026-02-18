import { FastifyRequest, FastifyReply } from "fastify";

export async function requireAuth(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const user = await request.jwtVerify<{ sub: string }>();
    (request as any).userId = user.sub;
  } catch {
    return reply.code(401).send({ error: "Unauthorized" });
  }
}

