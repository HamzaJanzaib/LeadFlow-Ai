import { Worker, Job } from "bullmq";
import { connection } from "../shared/redis";
import { SCAN_QUEUE_NAME } from "../queues/scan.queue";
import { db } from "@leadflow/db";
import { logger } from "../shared/logger";

interface ScanJobData {
  leadId: string;
  organizationId: string;
  url: string;
}

export const scanWorker = new Worker<ScanJobData>(
  SCAN_QUEUE_NAME,
  async (job: Job<ScanJobData>) => {
    const { leadId, organizationId, url } = job.data;
    logger.info(`Starting website scan for lead: ${leadId} at ${url}`);

    try {
      // -------------------------------------------------------------
      // MOCK AUDIT LOGIC (Playwright, Lighthouse, Wappalyzer)
      // -------------------------------------------------------------
      logger.info(`Mocking audit calls for url: ${url}`);
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate delay

      // Example mock data we would receive from a real scan
      const mockAuditData = {
        overallScore: Math.floor(Math.random() * 30) + 70,
        performanceScore: 85,
        seoScore: 92,
        accessibilityScore: 88,
        securityScore: 75,
        mobileScore: 90,
        uxScore: 82,
        dimensions: {
          performance: { loadTime: 1.2, tti: 2.1 },
        },
        issues: [
          { severity: "high", message: "Missing meta description" },
          { severity: "medium", message: "Images missing alt text" },
        ],
        opportunities: [
          { message: "Implement caching for static assets" }
        ],
        technologies: ["React", "Vercel", "Tailwind CSS"],
        pageLoadTime: 1.2,
        mobileReady: true,
        sslValid: true,
        salesInsight: "Their website performance is good, but SEO needs work. Pitch our SEO optimization package.",
        opportunityScore: 85,
      };

      // -------------------------------------------------------------

      const audit = await db.websiteAudit.create({
        data: {
          leadId,
          url,
          ...mockAuditData,
        },
      });

      // Log activity
      await db.leadActivity.create({
        data: {
          leadId,
          organizationId,
          type: "lead_audited",
          description: "Website audit was successfully completed.",
        },
      });

      logger.info(`Website scan complete for lead: ${leadId}`);
      return audit;
    } catch (error: any) {
      logger.error(`Website scan failed for lead: ${leadId}`, error);
      throw error; 
    }
  },
  { connection: connection as any }
);

scanWorker.on("failed", (job, err) => {
  logger.error(`Scan job ${job?.id} failed:`, err);
});
