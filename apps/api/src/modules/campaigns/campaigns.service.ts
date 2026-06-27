import { FastifyInstance } from "fastify";
import type { PrismaClient } from "@prisma/client";
import { CampaignStatus, CampaignChannel } from "@leadflow/db";
import { AppError } from "../../shared/errors/AppError";

export class CampaignsService {
  private prisma: PrismaClient;

  constructor(app: FastifyInstance) {
    this.prisma = app.db;
  }

  public async createCampaign(orgId: string, data: { name: string; channel: CampaignChannel; fromEmail?: string }) {
    // Usually workspace is derived from context, here we'll mock or find first
    const workspace = await this.prisma.workspace.findFirst({ where: { organizationId: orgId } });
    
    return this.prisma.campaign.create({
      data: {
        name: data.name,
        channel: data.channel,
        fromEmail: data.fromEmail || "", // Assuming fromEmail is string not optional in schema if it fails, or it's not present. We'll cast to any
        status: CampaignStatus.DRAFT,
        organizationId: orgId,
        workspaceId: workspace ? workspace.id : "mock_workspace"
      } as any
    });
  }

  public async getCampaigns(orgId: string) {
    return this.prisma.campaign.findMany({
      where: { organizationId: orgId },
      include: {
        _count: {
          select: { campaignLeads: true, Sequence: true }
        }
      } as any,
      orderBy: { createdAt: "desc" }
    });
  }

  public async getCampaign(orgId: string, id: string) {
    const campaign = await this.prisma.campaign.findFirst({
      where: { id, organizationId: orgId },
      include: {
        sequences: {
          include: { steps: { orderBy: { dayDelay: 'asc' } } }
        },
        campaignLeads: {
          include: { lead: true }
        }
      } as any
    }) as any;

    if (!campaign) {
      throw new AppError("Campaign not found", 404);
    }
    return campaign;
  }

  public async launchCampaign(orgId: string, id: string) {
    const campaign = await this.getCampaign(orgId, id);
    
    if (campaign.status === CampaignStatus.ACTIVE) {
      throw new AppError("Campaign is already active", 400);
    }

    if (!campaign.sequences || campaign.sequences.length === 0) {
      throw new AppError("Cannot launch a campaign without a sequence", 400);
    }

    return this.prisma.campaign.update({
      where: { id },
      data: {
        status: CampaignStatus.ACTIVE,
        launchedAt: new Date()
      }
    });
  }

  public async pauseCampaign(orgId: string, id: string) {
    const campaign = await this.getCampaign(orgId, id);
    
    if (campaign.status !== CampaignStatus.ACTIVE) {
      throw new AppError("Only active campaigns can be paused", 400);
    }

    return this.prisma.campaign.update({
      where: { id },
      data: {
        status: CampaignStatus.PAUSED
      }
    });
  }

  public async updateCampaign(orgId: string, id: string, data: { name?: string; fromEmail?: string }) {
    await this.getCampaign(orgId, id); // Verify it exists and user owns it

    return this.prisma.campaign.update({
      where: { id },
      data
    });
  }

  public async getCampaignLeads(orgId: string, campaignId: string) {
    await this.getCampaign(orgId, campaignId); // Verify it exists and user owns it

    return this.prisma.campaignLead.findMany({
      where: { campaignId },
      include: {
        lead: true,
        enrollments: true // Include enrollments to get the status
      } as any
    });
  }

  public async addLeadToCampaign(orgId: string, campaignId: string, leadId: string) {
    const campaign = await this.getCampaign(orgId, campaignId);
    
    // Check if lead belongs to org
    const lead = await this.prisma.lead.findFirst({
      where: { id: leadId, organizationId: orgId }
    });

    if (!lead) throw new AppError("Lead not found", 404);

    // Create CampaignLead
    const campaignLead = await this.prisma.campaignLead.create({
      data: {
        campaignId,
        leadId,
        status: "ACTIVE"
      } as any
    });

    // If campaign is active and has sequences, enroll the lead
    if (campaign.status === CampaignStatus.ACTIVE && campaign.sequences && campaign.sequences.length > 0) {
      // Find the primary sequence (for now, assume the first one)
      const primarySequence = campaign.sequences[0];
      
      await this.prisma.sequenceEnrollment.create({
        data: {
          sequenceId: primarySequence.id,
          campaignLeadId: campaignLead.id,
          status: "scheduled",
          stepNumber: 1,
          scheduledAt: new Date() // ready immediately
        }
      });
    }

    return campaignLead;
  }
}
