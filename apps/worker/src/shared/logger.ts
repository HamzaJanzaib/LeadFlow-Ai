import "dotenv/config";
import { createLogger, format, transports } from "winston";
import { Redis } from "ioredis";

export const logger = createLogger({
  level: process.env.LOG_LEVEL ?? "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    process.env.NODE_ENV === "development"
      ? format.combine(format.colorize(), format.simple())
      : format.json(),
  ),
  defaultMeta: { service: "leadflow-worker" },
  transports: [new transports.Console()],
});

// Redis connection shared across all queues
export const redis = new Redis(
  process.env.REDIS_URL ?? "redis://localhost:6379",
  {
    password: process.env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null, // Required for BullMQ
    enableReadyCheck: false,
  },
);

redis.on("error", (err) => {
  logger.error("Redis error", { err });
});

redis.on("connect", () => {
  logger.info("Redis connected");
});
