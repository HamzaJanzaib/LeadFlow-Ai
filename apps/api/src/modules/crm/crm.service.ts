import type { FastifyInstance } from "fastify";
import { AppError } from "../../shared/errors/AppError";

// --- Pipelines ---
export async function listPipelines(fastify: FastifyInstance, organizationId: string, workspaceId: string) {
  return await fastify.db.pipeline.findMany({
    where: { organizationId, workspaceId },
    orderBy: { createdAt: "asc" }
  });
}

export async function createPipeline(fastify: FastifyInstance, organizationId: string, workspaceId: string, data: any) {
  // If this is set to default, unset other defaults
  if (data.isDefault) {
    await fastify.db.pipeline.updateMany({
      where: { organizationId, workspaceId, isDefault: true },
      data: { isDefault: false }
    });
  }

  return await fastify.db.pipeline.create({
    data: {
      ...data,
      organizationId,
      workspaceId
    }
  });
}

// --- Deals ---
export async function listDeals(fastify: FastifyInstance, organizationId: string, pipelineId?: string) {
  const where: any = { organizationId };
  if (pipelineId) where.pipelineId = pipelineId;

  return await fastify.db.deal.findMany({
    where,
    include: {
      lead: { select: { id: true, company: true, email: true, phone: true } },
      owner: { select: { id: true, name: true, avatarUrl: true } }
    },
    orderBy: { updatedAt: "desc" }
  });
}

export async function getDeal(fastify: FastifyInstance, organizationId: string, dealId: string) {
  const deal = await fastify.db.deal.findFirst({
    where: { id: dealId, organizationId },
    include: {
      lead: true,
      tasks: { orderBy: { dueDate: "asc" } },
      meetings: { orderBy: { scheduledAt: "desc" } },
      notes: { orderBy: { createdAt: "desc" } },
      attachments: { orderBy: { createdAt: "desc" } },
      owner: { select: { id: true, name: true, avatarUrl: true } }
    }
  });

  if (!deal) throw AppError.notFound("Deal");
  return deal;
}

export async function createDeal(fastify: FastifyInstance, organizationId: string, data: any, userId: string) {
  // Verify pipeline belongs to org
  const pipeline = await fastify.db.pipeline.findFirst({
    where: { id: data.pipelineId, organizationId }
  });
  if (!pipeline) throw AppError.badRequest("Invalid pipeline");

  const deal = await fastify.db.deal.create({
    data: {
      ...data,
      organizationId,
      ownerId: userId // creator is default owner
    }
  });

  // Log activity if lead is attached
  if (data.leadId) {
    await fastify.db.leadActivity.create({
      data: {
        leadId: data.leadId,
        organizationId,
        userId,
        type: "deal_created",
        description: `Deal created: ${data.title}`
      }
    });
  }

  return deal;
}

export async function updateDealStage(
  fastify: FastifyInstance, 
  organizationId: string, 
  dealId: string, 
  stage: any, 
  userId: string
) {
  const deal = await fastify.db.deal.findFirst({
    where: { id: dealId, organizationId }
  });
  if (!deal) throw AppError.notFound("Deal");

  const updated = await fastify.db.deal.update({
    where: { id: dealId },
    data: { stage }
  });

  // Log audit/activity
  await fastify.db.auditLog.create({
    data: {
      organizationId,
      userId,
      action: "deal.stage_changed",
      resource: "deal",
      resourceId: dealId,
      payload: { from: deal.stage, to: stage }
    }
  });

  if (deal.leadId) {
    await fastify.db.leadActivity.create({
      data: {
        leadId: deal.leadId,
        organizationId,
        userId,
        type: "deal_stage_changed",
        description: `Deal moved from ${deal.stage} to ${stage}`
      }
    });
  }

  return updated;
}

// --- Tasks ---
export async function createTask(fastify: FastifyInstance, organizationId: string, data: any) {
  return await fastify.db.task.create({
    data: {
      ...data,
      organizationId
    }
  });
}

// --- Meetings ---
export async function createMeeting(fastify: FastifyInstance, organizationId: string, data: any) {
  return await fastify.db.meeting.create({
    data: {
      ...data,
      organizationId
    }
  });
}
