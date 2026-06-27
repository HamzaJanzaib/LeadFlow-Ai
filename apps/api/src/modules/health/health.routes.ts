import type { FastifyPluginAsync } from "fastify";

export const healthRoutes: FastifyPluginAsync = async (fastify) => {
  // ── GET /health ────────────────────────────────────────────────────────────
  fastify.get(
    "/health",
    {
      schema: {
        tags: ["Health"],
        summary: "Health check",
        response: {
          200: {
            type: "object",
            properties: {
              status: { type: "string" },
              version: { type: "string" },
              timestamp: { type: "string" },
              uptime: { type: "number" },
            },
          },
        },
      },
    },
    async (_req, reply) => {
      return reply.send({
        status: "ok",
        version: "1.0.0",
        timestamp: new Date().toISOString(),
        uptime: Math.floor(process.uptime()),
      });
    },
  );

  // ── GET /health/db ────────────────────────────────────────────────────────
  fastify.get(
    "/health/db",
    {
      schema: {
        tags: ["Health"],
        summary: "Database health check",
      },
    },
    async (_req, reply) => {
      try {
        await fastify.db.$queryRaw`SELECT 1`;
        return reply.send({
          status: "ok",
          database: "connected",
          timestamp: new Date().toISOString(),
        });
      } catch (err) {
        return reply.status(503).send({
          status: "error",
          database: "disconnected",
          error: (err as Error).message,
          timestamp: new Date().toISOString(),
        });
      }
    },
  );

  // ── GET /health/redis ──────────────────────────────────────────────────────
  fastify.get(
    "/health/redis",
    {
      schema: {
        tags: ["Health"],
        summary: "Redis health check",
      },
    },
    async (_req, reply) => {
      try {
        const pong = await fastify.redis.ping();
        return reply.send({
          status: "ok",
          redis: pong === "PONG" ? "connected" : "degraded",
          timestamp: new Date().toISOString(),
        });
      } catch (err) {
        return reply.status(503).send({
          status: "error",
          redis: "disconnected",
          error: (err as Error).message,
          timestamp: new Date().toISOString(),
        });
      }
    },
  );
};
