import { Queue, Worker, Job } from "bullmq";
import { SyncProcessor, SyncJobData } from "../processors/sync.processor";
import Redis from "ioredis";

// Use an existing Redis connection or create a new one based on ENV
const connection = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

const SYNC_QUEUE_NAME = "knowledge_sync";

export const syncQueue = new Queue<SyncJobData>(SYNC_QUEUE_NAME, { connection: connection as any });

export function startSyncWorker() {
  const processor = new SyncProcessor();

  const worker = new Worker<SyncJobData>(
    SYNC_QUEUE_NAME,
    async (job: Job<SyncJobData>) => {
      await processor.processJob({ id: job.id!, data: job.data });
    },
    { connection: connection as any, concurrency: 5 }
  );

  worker.on("completed", (job) => {
    console.log(`[SyncWorker] Job ${job.id} completed successfully`);
  });

  worker.on("failed", (job, err) => {
    console.error(`[SyncWorker] Job ${job?.id} failed with error:`, err);
  });

  console.log(`[SyncWorker] Started processing on queue: ${SYNC_QUEUE_NAME}`);
  return worker;
}
