import fp from "fastify-plugin";
import Redis from "ioredis";
import type { FastifyPluginAsync } from "fastify";

const redisPlugin: FastifyPluginAsync = fp(async (fastify) => {
  const redis = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379", {
    password: process.env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: 3,
    lazyConnect: true,
    retryStrategy: (times) => {
      if (times > 5) return null;
      return Math.min(times * 200, 2000);
    },
  });

  redis.on("error", (err) => {
    fastify.log.error({ err }, "Redis connection error");
  });

  redis.on("connect", () => {
    fastify.log.info("Redis connected");
  });

  await redis.connect();

  fastify.decorate("redis", redis);

  fastify.addHook("onClose", async () => {
    await redis.quit();
    fastify.log.info("Redis disconnected");
  });
});

export { redisPlugin };
