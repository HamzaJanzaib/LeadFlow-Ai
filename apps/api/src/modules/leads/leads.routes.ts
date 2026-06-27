import type { FastifyPluginAsync } from "fastify";
import { requireAuth } from "../../middleware/authenticate";
import { requireOrg } from "../../middleware/tenantScope";
import * as LeadService from "./leads.service";
import {
  createLeadSchema,
  updateLeadSchema,
  getLeadsQuerySchema,
  bulkActionSchema,
} from "./leads.schema";

export const leadsRoutes: FastifyPluginAsync = async (fastify) => {
  // All lead routes require authentication and an active organization context
  fastify.addHook("preHandler", requireAuth);
  fastify.addHook("preHandler", requireOrg);

  /**
   * GET /leads
   * List leads with pagination and filtering
   */
  fastify.get("/", async (request, reply) => {
    const query = getLeadsQuerySchema.parse(request.query) as any;
    const orgId = request.organizationId!;
    // Defaulting to "general" workspace for now as per simple setup,
    // but ideally we'd fetch from request header or user preference
    const workspace = await fastify.db.workspace.findFirst({
      where: { organizationId: orgId }
    });
    
    if (!workspace) {
      return reply.status(400).send({ error: "No workspace found" });
    }

    const result = await LeadService.listLeads(
      fastify,
      orgId,
      workspace.id,
      query
    );
    return reply.send(result);
  });

  /**
   * GET /leads/:id
   * Get single lead details
   */
  fastify.get<{ Params: { id: string } }>("/:id", async (request, reply) => {
    const { id } = request.params;
    const orgId = request.organizationId!;
    
    const workspace = await fastify.db.workspace.findFirst({
      where: { organizationId: orgId }
    });

    const lead = await LeadService.getLead(fastify, orgId, workspace!.id, id);
    return reply.send(lead);
  });

  /**
   * POST /leads
   * Create a new manual lead
   */
  fastify.post("/", async (request, reply) => {
    const data = createLeadSchema.parse(request.body);
    const orgId = request.organizationId!;
    const userId = request.user!.id;

    const workspace = await fastify.db.workspace.findFirst({
      where: { organizationId: orgId }
    });

    const lead = await LeadService.createLead(fastify, orgId, workspace!.id, data, userId);
    return reply.status(201).send(lead);
  });

  /**
   * PUT /leads/:id
   * Update lead fields
   */
  fastify.put<{ Params: { id: string } }>("/:id", async (request, reply) => {
    const { id } = request.params;
    const data = updateLeadSchema.parse(request.body);
    const orgId = request.organizationId!;
    const userId = request.user!.id;

    const workspace = await fastify.db.workspace.findFirst({
      where: { organizationId: orgId }
    });

    const lead = await LeadService.updateLead(fastify, orgId, workspace!.id, id, data, userId);
    return reply.send(lead);
  });

  /**
   * DELETE /leads/:id
   * Soft-delete a lead (archive)
   */
  fastify.delete<{ Params: { id: string } }>("/:id", async (request, reply) => {
    const { id } = request.params;
    const orgId = request.organizationId!;

    const workspace = await fastify.db.workspace.findFirst({
      where: { organizationId: orgId }
    });

    const result = await LeadService.deleteLead(fastify, orgId, workspace!.id, id);
    return reply.send({ success: true, id: result.id });
  });

  /**
   * POST /leads/:id/enrich
   * Trigger enrichment job
   */
  fastify.post<{ Params: { id: string } }>("/:id/enrich", async (request, reply) => {
    const { id } = request.params;
    const orgId = request.organizationId!;
    const workspace = await fastify.db.workspace.findFirst({ where: { organizationId: orgId } });
    
    const result = await LeadService.triggerEnrichment(fastify, orgId, workspace!.id, id);
    return reply.send(result);
  });

  /**
   * POST /leads/:id/scan
   * Trigger website scan job
   */
  fastify.post<{ Params: { id: string }, Body: { url: string } }>("/:id/scan", async (request, reply) => {
    const { id } = request.params;
    const { url } = request.body;
    const orgId = request.organizationId!;
    const workspace = await fastify.db.workspace.findFirst({ where: { organizationId: orgId } });
    
    const result = await LeadService.triggerScan(fastify, orgId, workspace!.id, id, url);
    return reply.send(result);
  });

  /**
   * POST /leads/bulk
   * Perform bulk actions on leads
   */
  fastify.post("/bulk", async (request, reply) => {
    const data = bulkActionSchema.parse(request.body) as any;
    const orgId = request.organizationId!;
    const userId = request.user!.id;

    const workspace = await fastify.db.workspace.findFirst({
      where: { organizationId: orgId }
    });

    const result = await LeadService.bulkUpdateLeads(fastify, orgId, workspace!.id, data, userId);
    return reply.send(result);
  });
};
