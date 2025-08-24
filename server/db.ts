import { PrismaClient } from "@prisma/client";

// Extend globalThis with a prisma property to avoid multiple instances in dev
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query", "error", "warn"], // logs for debugging
  });

// Store the Prisma instance in globalThis only in development
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
