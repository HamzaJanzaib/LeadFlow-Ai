import fp from "fastify-plugin";
import { db } from "@leadflow/db";
import type { FastifyPluginAsync } from "fastify";

const prismaPlugin: FastifyPluginAsync = fp(async (fastify) => {
  fastify.decorate("db", db);

  fastify.addHook("onClose", async () => {
    await db.$disconnect();
    fastify.log.info("Prisma client disconnected");
  });
});

export { prismaPlugin };
