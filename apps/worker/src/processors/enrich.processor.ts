import { Worker, Job } from "bullmq";
import { connection } from "../shared/redis";
import { ENRICH_QUEUE_NAME } from "../queues/enrich.queue";
import { db } from "@leadflow/db";
import { logger } from "../shared/logger";

interface EnrichJobData {
  leadId: string;
  organizationId: string;
}

export const enrichWorker = new Worker<EnrichJobData>(
  ENRICH_QUEUE_NAME,
  async (job: Job<EnrichJobData>) => {
    const { leadId, organizationId } = job.data;
    logger.info(`Starting enrichment for lead: ${leadId}`);

    const lead = await db.lead.findFirst({
      where: { id: leadId, organizationId },
    });

    if (!lead) {
      logger.warn(`Lead ${leadId} not found, skipping enrichment.`);
      return;
    }

    // Mark as enriching
    await db.lead.update({
      where: { id: leadId },
      data: { status: "ENRICHING" },
    });

    try {
      // -------------------------------------------------------------
      // MOCK ENRICHMENT LOGIC (Hunter.io / Apollo)
      // -------------------------------------------------------------
      logger.info(`Mocking enrichment calls for company: ${lead.company}`);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API delay

      // Example mock data we would receive from enrichment APIs
      const mockEnrichedData: any = {
        employees: 150,
        revenue: 5000000,
        industry: lead.industry || "Software Development",
        technologies: ["React", "Node.js", "AWS"],
        status: "ENRICHED",
        score: Math.floor(Math.random() * 50) + 50, // Mock score boost
      };

      // -------------------------------------------------------------

      const updated = await db.lead.update({
        where: { id: leadId },
        data: mockEnrichedData,
      });

      // Log activity
      await db.leadActivity.create({
        data: {
          leadId,
          organizationId,
          type: "lead_enriched",
          description: "Lead was successfully enriched via background worker.",
        },
      });

      logger.info(`Enrichment complete for lead: ${leadId}`);
      return updated;
    } catch (error: any) {
      logger.error(`Enrichment failed for lead: ${leadId}`, error);
      // Revert status
      await db.lead.update({
        where: { id: leadId },
        data: { status: "NEW" },
      });
      throw error; // Will be caught by BullMQ for retries
    }
  },
  { connection: connection as any }
);

enrichWorker.on("failed", (job, err) => {
  logger.error(`Enrichment job ${job?.id} failed:`, err);
});
