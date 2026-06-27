import "dotenv/config";
import { logger } from "./shared/logger";

// import { startAiWorker } from "./queues/ai.queue";
// import { startEnrichWorker } from "./queues/enrich.queue";
import { startEmailWorker } from "./queues/email.queue";
import { startSequenceScheduler } from "./schedulers/sequence.scheduler";
// import { startScanWorker } from "./queues/scan.queue";
// import { startSyncWorker } from "./queues/sync.queue";
// import { startReportWorker } from "./queues/report.queue";

async function main() {
  logger.info("🔧 LeadFlow AI Worker starting...");

  // await startAiWorker();
  // await startEnrichWorker();
  await startEmailWorker();
  await startSequenceScheduler();
  // await startScanWorker();
  // await startSyncWorker();
  // await startReportWorker();

  logger.info("✅ All queue workers running");
  logger.info("📊 Worker ready — waiting for jobs...");
}

// Graceful shutdown
const shutdown = async (signal: string) => {
  logger.info(`${signal} received — shutting down workers gracefully...`);
  process.exit(0);
};

process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));

void main().catch((err) => {
  logger.error("Worker startup failed", { err });
  process.exit(1);
});
