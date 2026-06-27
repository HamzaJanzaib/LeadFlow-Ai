import Redis from "ioredis";

export const connection = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379", 10),
  maxRetriesPerRequest: null,
});

connection.on("ready", async () => {
  try {
    await connection.config("SET", "maxmemory-policy", "noeviction");
  } catch (err) {
    // Ignore if not allowed or not supported
  }
});
