import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "./env";

const adapter = new PrismaPg({
  url: env.databaseUrl,
});

export const prisma = new PrismaClient({ adapter });

