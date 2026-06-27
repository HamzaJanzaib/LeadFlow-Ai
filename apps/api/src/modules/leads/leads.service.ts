import type { FastifyInstance } from "fastify";
import { Prisma } from "@leadflow/db";
import { AppError } from "../../shared/errors/AppError";
import { Queue } from "bullmq";

const enrichQueue = new Queue("lead-enrichment", {
  connection: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
  }
});

const scanQueue = new Queue("website-scan", {
  connection: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
  }
});
import { logEvent } from "../../shared/utils/auditLog";

export async function listLeads(
  fastify: FastifyInstance,
  organizationId: string,
  workspaceId: string,
  query: {
    page: number;
    limit: number;
    search?: string;
    status?: any;
    source?: any;
    sortBy: string;
    sortOrder: "asc" | "desc";
  }
) {
  const { page, limit, search, status, source, sortBy, sortOrder } = query;
  
  const where: Prisma.LeadWhereInput = {
    organizationId,
    workspaceId,
    ...(status && { status }),
    ...(source && { source }),
    ...(search && {
      OR: [
        { company: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } }
      ]
    })
  };

  const [total, leads] = await Promise.all([
    fastify.db.lead.count({ where }),
    fastify.db.lead.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        owner: { select: { id: true, name: true, avatarUrl: true } },
      }
    })
  ]);

  return {
    data: leads,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
}

export async function getLead(
  fastify: FastifyInstance,
  organizationId: string,
  workspaceId: string,
  leadId: string
) {
  const lead = await fastify.db.lead.findFirst({
    where: { id: leadId, organizationId, workspaceId },
    include: {
      owner: { select: { id: true, name: true, avatarUrl: true } },
      contacts: true,
      scores: { orderBy: { scoredAt: "desc" }, take: 1 },
      activities: { orderBy: { createdAt: "desc" }, take: 20 },
      websiteAudits: { orderBy: { auditedAt: "desc" }, take: 1 },
      deals: { select: { id: true, title: true, stage: true, value: true } }
    }
  });

  if (!lead) {
    throw AppError.notFound("Lead");
  }

  return lead;
}

export async function createLead(
  fastify: FastifyInstance,
  organizationId: string,
  workspaceId: string,
  data: any,
  userId: string
) {
  const lead = await fastify.db.lead.create({
    data: {
      ...data,
      organizationId,
      workspaceId,
      ownerId: userId // default to creator
    }
  });

  // Automatically log creation
  await fastify.db.leadActivity.create({
    data: {
      leadId: lead.id,
      organizationId,
      userId,
      type: "lead_created",
      description: "Lead was created manually"
    }
  });

  return lead;
}

export async function updateLead(
  fastify: FastifyInstance,
  organizationId: string,
  workspaceId: string,
  leadId: string,
  data: any,
  userId: string
) {
  const lead = await fastify.db.lead.findFirst({
    where: { id: leadId, organizationId, workspaceId }
  });

  if (!lead) {
    throw AppError.notFound("Lead");
  }

  const updated = await fastify.db.lead.update({
    where: { id: leadId },
    data
  });

  // Audit log for update (could be more granular)
  await fastify.db.leadActivity.create({
    data: {
      leadId,
      organizationId,
      userId,
      type: "lead_updated",
      description: "Lead details were updated"
    }
  });

  return updated;
}

export async function deleteLead(
  fastify: FastifyInstance,
  organizationId: string,
  workspaceId: string,
  leadId: string
) {
  const lead = await fastify.db.lead.findFirst({
    where: { id: leadId, organizationId, workspaceId }
  });

  if (!lead) {
    throw AppError.notFound("Lead");
  }

  // Soft delete via status update
  const archived = await fastify.db.lead.update({
    where: { id: leadId },
    data: { status: "ARCHIVED" }
  });

  return archived;
}

export async function bulkUpdateLeads(
  fastify: FastifyInstance,
  organizationId: string,
  workspaceId: string,
  data: { leadIds: string[], action: string, status?: any, ownerId?: string, tags?: string[] },
  userId: string
) {
  const { leadIds, action, status, ownerId, tags } = data;

  // Ensure all leads belong to org and workspace
  const validLeads = await fastify.db.lead.findMany({
    where: { id: { in: leadIds }, organizationId, workspaceId },
    select: { id: true }
  });

  const validIds = validLeads.map((l: any) => l.id);
  
  if (validIds.length === 0) {
    throw AppError.badRequest("No valid leads found to perform bulk action");
  }

  let updatedCount = 0;

  if (action === "update_status" && status) {
    const res = await fastify.db.lead.updateMany({
      where: { id: { in: validIds } },
      data: { status }
    });
    updatedCount = res.count;
  } else if (action === "assign" && ownerId !== undefined) {
    const res = await fastify.db.lead.updateMany({
      where: { id: { in: validIds } },
      data: { ownerId: ownerId || null }
    });
    updatedCount = res.count;
  } else if (action === "delete") {
    const res = await fastify.db.lead.updateMany({
      where: { id: { in: validIds } },
      data: { status: "ARCHIVED" }
    });
    updatedCount = res.count;
  } else if (action === "add_tags" && tags && tags.length > 0) {
    // Prisma currently doesn't support pushing to array in updateMany easily
    // We'll iterate for tags
    for (const id of validIds) {
      const lead = await fastify.db.lead.findUnique({ where: { id }, select: { tags: true } });
      const newTags = Array.from(new Set([...(lead?.tags || []), ...tags]));
      await fastify.db.lead.update({
        where: { id },
        data: { tags: newTags }
      });
    }
    updatedCount = validIds.length;
  }

  return { success: true, updatedCount };
}

export async function triggerEnrichment(
  fastify: FastifyInstance,
  organizationId: string,
  workspaceId: string,
  leadId: string
) {
  const lead = await fastify.db.lead.findFirst({
    where: { id: leadId, organizationId, workspaceId }
  });

  if (!lead) throw AppError.notFound("Lead");

  await enrichQueue.add("enrich-job", { leadId, organizationId });
  
  return { success: true, message: "Enrichment job queued" };
}

export async function triggerScan(
  fastify: FastifyInstance,
  organizationId: string,
  workspaceId: string,
  leadId: string,
  url: string
) {
  const lead = await fastify.db.lead.findFirst({
    where: { id: leadId, organizationId, workspaceId }
  });

  if (!lead) throw AppError.notFound("Lead");

  await scanQueue.add("scan-job", { leadId, organizationId, url });
  
  return { success: true, message: "Scan job queued" };
}
