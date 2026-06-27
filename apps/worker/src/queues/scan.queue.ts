import { Queue } from "bullmq";
import { connection } from "../shared/redis";

export const SCAN_QUEUE_NAME = "website-scan";

export const scanQueue = new Queue(SCAN_QUEUE_NAME, {
  connection: connection as any,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 10000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});
