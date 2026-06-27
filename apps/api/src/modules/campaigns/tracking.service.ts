import { FastifyInstance } from "fastify";
import type { PrismaClient } from "@prisma/client";
import { CampaignStatus } from "@leadflow/db";

export class TrackingService {
  private prisma: PrismaClient;

  constructor(app: FastifyInstance) {
    this.prisma = app.db;
  }

  public async trackOpen(eventId: string, userAgent: string, ip: string) {
    const event = await this.prisma.emailEvent.findUnique({
      where: { id: eventId }
    });

    if (event && (event as any).event !== "OPENED") {
      await this.prisma.emailEvent.update({
        where: { id: eventId },
        data: {
          event: "OPENED" as any,
          metadata: { userAgent, ip }
        }
      });
    }
  }

  public async trackClick(eventId: string, url: string, userAgent: string, ip: string) {
    const event = await this.prisma.emailEvent.findUnique({
      where: { id: eventId }
    });

    if (event) {
      await this.prisma.emailEvent.create({
        data: {
          organizationId: event.organizationId,
          campaignId: event.campaignId,
          leadId: event.leadId,
          event: "CLICKED" as any,
          recipientEmail: event.recipientEmail,
          metadata: { url, userAgent, ip }
        }
      });
    }
  }

  public async handleReply(leadEmail: string, content: string) {
    // 1. Find the active sequence enrollment for this lead
    const enrollments = await this.prisma.sequenceEnrollment.findMany({
      where: {
        status: "scheduled",
        campaignLead: { lead: { email: leadEmail } }
      },
      include: { campaignLead: true }
    });

    for (const enrollment of enrollments) {
      // 2. Mark sequence as STOPPED
      await this.prisma.sequenceEnrollment.update({
        where: { id: enrollment.id },
        data: { status: "stopped" }
      });

      // 3. Mark CampaignLead as replied
      if (enrollment.campaignLeadId) {
        await this.prisma.campaignLead.update({
          where: { id: enrollment.campaignLeadId },
          data: { status: "REPLIED" }
        });
      }
    }
  }
}
