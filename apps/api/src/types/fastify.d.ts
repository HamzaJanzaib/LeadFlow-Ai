import type { PrismaClient } from "@prisma/client";
import type Redis from "ioredis";

// Augment Fastify types to include our plugins
declare module "fastify" {
  interface FastifyInstance {
    db: PrismaClient;
    redis: Redis;
  }

  interface FastifyRequest {
    user?: {
      id: string;
      email: string;
      name: string;
      role: string;
      organizationId: string;
      workspaceId?: string;
    };
    organization?: {
      id: string;
      name: string;
      slug: string;
      plan: string;
    };
    organizationId?: string;
  }
}

export {};
