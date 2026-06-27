import { Queue, Worker, Job } from "bullmq";
import { logger } from "../shared/logger";
import { connection } from "../shared/redis";
import { db } from "@leadflow/db";
import { emailQueue } from "../queues/email.queue";

const prisma = db;

// High level scheduler queue that runs periodically
export const sequenceSchedulerQueue = new Queue("sequence-scheduler", { connection: connection as any });

const sequenceSchedulerProcessor = async (job: Job) => {
  logger.info("[Sequence Scheduler] Checking for sequence steps to execute...");

  const now = new Date();

  // Find active enrollments where nextStepDate is in the past
  const enrollments = await prisma.sequenceEnrollment.findMany({
    where: {
      status: "scheduled",
      scheduledAt: { lte: now }
    },
    include: {
      sequence: { include: { steps: { orderBy: { stepNumber: 'asc' } } } },
      campaignLead: { include: { lead: true, campaign: true } }
    }
  });

  logger.info(`[Sequence Scheduler] Found ${enrollments.length} pending enrollments.`);

  for (const enrollment of enrollments) {
    const steps = enrollment.sequence.steps;
    // Arrays are 0-indexed, stepNumber is 1-indexed usually
    const currentStepIndex = steps.findIndex(s => s.stepNumber === enrollment.stepNumber);
    const currentStep = steps[currentStepIndex];

    if (!currentStep) {
      // Reached the end of the sequence
      await prisma.sequenceEnrollment.update({
        where: { id: enrollment.id },
        data: { status: "completed" }
      });
      continue;
    }

    if (currentStep.channel === "EMAIL" || currentStep.channel === "email" as any) {
      // 1. Create an EmailEvent (to get the Tracking Pixel ID)
      const event = await prisma.emailEvent.create({
        data: {
          organizationId: enrollment.campaignLead.campaign.organizationId,
          campaignId: enrollment.campaignLead.campaign.id,
          leadId: enrollment.campaignLead.leadId,
          event: "SENT" as any,
          recipientEmail: enrollment.campaignLead.lead.email || ""
        }
      });

      // 2. Inject tracking pixel into the HTML content
      const API_URL = process.env.API_URL || "http://localhost:4000/api/v1";
      const trackingPixelUrl = `${API_URL}/track/open/${event.id}`;
      const pixelImg = `<img src="${trackingPixelUrl}" width="1" height="1" alt="" />`;
      const htmlWithTracking = `${currentStep.bodyTemplate}${pixelImg}`;

      // 3. Queue the email sending job
      await emailQueue.add("send-email", {
        eventId: event.id,
        to: enrollment.campaignLead.lead.email || "",
        subject: currentStep.subjectTemplate || "Follow up",
        htmlContent: htmlWithTracking
      });
    }

    // Determine the next step and schedule it
    const nextStepIndex = currentStepIndex + 1;
    const nextStep = steps[nextStepIndex];

    if (nextStep) {
      // Calculate delay based on the difference between the next step's delay and the current step's delay
      const daysDelay = (nextStep.dayDelay || 0) - (currentStep.dayDelay || 0);
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + Math.max(0, daysDelay));

      await prisma.sequenceEnrollment.update({
        where: { id: enrollment.id },
        data: {
          stepNumber: nextStep.stepNumber,
          scheduledAt: nextDate,
          sentAt: new Date()
        }
      });
    } else {
      // Sequence done
      await prisma.sequenceEnrollment.update({
        where: { id: enrollment.id },
        data: {
          status: "completed",
          sentAt: new Date()
        }
      });
    }
  }
};

export const startSequenceScheduler = async () => {
  const worker = new Worker("sequence-scheduler", sequenceSchedulerProcessor, { connection: connection as any });
  
  worker.on("completed", (job) => logger.info(`[Scheduler Worker] Job ${job.id} completed.`));
  worker.on("failed", (job, err) => logger.error(`[Scheduler Worker] Job ${job?.id} failed`, { err }));
  
  // Set up the repeatable job (runs every 15 minutes)
  await sequenceSchedulerQueue.add("run-scheduler", {}, {
    repeat: { pattern: "*/15 * * * *" }
  });

  logger.info("✅ Sequence Scheduler Worker started (15m interval).");
};
