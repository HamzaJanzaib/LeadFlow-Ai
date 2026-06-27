import "dotenv/config";
import { buildServer } from "./server";

const PORT = parseInt(process.env.PORT ?? "4000");
const HOST = process.env.HOST ?? "0.0.0.0";

async function start() {
  const app = await buildServer();

  try {
    await app.listen({ port: PORT, host: HOST });
    console.log(`\n🚀 LeadFlow AI API running at http://localhost:${PORT}`);
    console.log(`📚 API Docs at http://localhost:${PORT}/docs\n`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received — shutting down gracefully...");
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received — shutting down gracefully...");
  process.exit(0);
});

void start();
