import { Queue } from "bullmq";
import { connection } from "../shared/redis";

export const ENRICH_QUEUE_NAME = "lead-enrichment";

export const enrichQueue = new Queue(ENRICH_QUEUE_NAME, {
  connection: connection as any,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});
