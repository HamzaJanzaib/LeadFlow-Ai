import { Queue, Worker, Job } from "bullmq";
import { logger } from "../shared/logger";
import { connection } from "../shared/redis";
import { Resend } from "resend";
import { db } from "@leadflow/db";

const prisma = db;
// We'll mock Resend if no API key is provided, so it doesn't crash in local dev
const resendApiKey = process.env.RESEND_API_KEY || "re_mock";
const resend = new Resend(resendApiKey);

export const emailQueue = new Queue("email-queue", { connection: connection as any });

export interface EmailJobData {
  eventId: string;
  to: string;
  subject: string;
  htmlContent: string;
}

const emailProcessor = async (job: Job<EmailJobData>) => {
  const { eventId, to, subject, htmlContent } = job.data;
  
  logger.info(`[Email Processor] Sending email to ${to} (EventID: ${eventId})`);

  // Wrap links in click tracking URL
  const API_URL = process.env.API_URL || "http://localhost:4000/api/v1";
  const processedHtml = htmlContent.replace(
    /href=["'](http[^"']+)["']/g, 
    (match, url) => `href="${API_URL}/track/click/${eventId}?url=${encodeURIComponent(url)}"`
  );

  try {
    if (resendApiKey === "re_mock") {
      logger.warn(`[Email Processor] MOCK SEND: No RESEND_API_KEY found.`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    } else {
      await resend.emails.send({
        from: "LeadFlow AI <hello@yourdomain.com>", // Update to actual verified domain later
        to,
        subject,
        html: processedHtml
      });
    }

    // Mark event as sent
    await prisma.emailEvent.update({
      where: { id: eventId },
      data: { event: "DELIVERED" as any }
    });

  } catch (error) {
    logger.error(`[Email Processor] Failed to send email to ${to}`, { error });
    await prisma.emailEvent.update({
      where: { id: eventId },
      data: { event: "BOUNCED" as any } // Marking failed sends as bounced for simplicity
    });
    throw error;
  }
};

export const startEmailWorker = async () => {
  const worker = new Worker("email-queue", emailProcessor, { connection: connection as any });
  
  worker.on("completed", (job) => logger.info(`[Email Worker] Job ${job.id} completed.`));
  worker.on("failed", (job, err) => logger.error(`[Email Worker] Job ${job?.id} failed`, { err }));
  
  logger.info("✅ Email Worker started.");
};
