import { FastifyInstance } from "fastify";
import type { PrismaClient } from "@prisma/client";
import { AppError } from "../../shared/errors/AppError";

export class SequencesService {
  private prisma: PrismaClient;

  constructor(app: FastifyInstance) {
    this.prisma = app.db;
  }

  public async createSequence(orgId: string, campaignId: string, data: { name: string }) {
    const campaign = await this.prisma.campaign.findFirst({
      where: { id: campaignId, organizationId: orgId }
    });

    if (!campaign) throw new AppError("Campaign not found", 404);

    return this.prisma.sequence.create({
      data: {
        name: data.name,
        campaignId,
      }
    });
  }

  public async addSequenceStep(orgId: string, campaignId: string, sequenceId: string, data: { type: string, content: string, subject?: string, dayOffset: number }) {
    const sequence = await this.prisma.sequence.findFirst({
      where: { 
        id: sequenceId, 
        campaignId,
        campaign: { organizationId: orgId }
      }
    });

    if (!sequence) throw new AppError("Sequence not found", 404);

    return this.prisma.sequenceStep.create({
      data: {
        sequenceId,
        channel: data.type as any, // assuming Enum casting
        bodyTemplate: data.content,
        subjectTemplate: data.subject,
        dayDelay: data.dayOffset || 0,
        stepNumber: data.dayOffset || 1 // Assuming stepNumber maps to dayOffset/order for now
      } as any // Use any for fast resolution in typing
    });
  }

  public async getSequences(orgId: string, campaignId: string) {
    // Verify campaign belongs to org
    const campaign = await this.prisma.campaign.findFirst({
      where: { id: campaignId, organizationId: orgId }
    });
    if (!campaign) throw new AppError("Campaign not found", 404);

    return this.prisma.sequence.findMany({
      where: { campaignId },
      include: {
        steps: { orderBy: { stepNumber: 'asc' } }
      } as any
    });
  }

  public async updateSequence(orgId: string, campaignId: string, sequenceId: string, data: { name?: string }) {
    // Verify sequence belongs to campaign and org
    const sequence = await this.prisma.sequence.findFirst({
      where: { id: sequenceId, campaignId, campaign: { organizationId: orgId } }
    });
    if (!sequence) throw new AppError("Sequence not found", 404);

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;

    return this.prisma.sequence.update({
      where: { id: sequenceId },
      data: updateData
    });
  }

  public async updateSequenceStep(orgId: string, campaignId: string, sequenceId: string, stepId: string, data: { type?: string, content?: string, subject?: string, dayOffset?: number }) {
    // Verify sequence belongs to campaign and org
    const sequence = await this.prisma.sequence.findFirst({
      where: { id: sequenceId, campaignId, campaign: { organizationId: orgId } }
    });
    if (!sequence) throw new AppError("Sequence not found", 404);

    const updateData: any = {};
    if (data.type) updateData.channel = data.type as any;
    if (data.content !== undefined) updateData.bodyTemplate = data.content;
    if (data.subject !== undefined) updateData.subjectTemplate = data.subject;
    if (data.dayOffset !== undefined) {
      updateData.dayDelay = data.dayOffset;
      updateData.stepNumber = data.dayOffset;
    }

    return this.prisma.sequenceStep.update({
      where: { id: stepId },
      data: updateData
    });
  }

  public async deleteSequenceStep(orgId: string, campaignId: string, sequenceId: string, stepId: string) {
    // Verify sequence belongs to campaign and org
    const sequence = await this.prisma.sequence.findFirst({
      where: { id: sequenceId, campaignId, campaign: { organizationId: orgId } }
    });
    if (!sequence) throw new AppError("Sequence not found", 404);

    return this.prisma.sequenceStep.delete({
      where: { id: stepId }
    });
  }
}
