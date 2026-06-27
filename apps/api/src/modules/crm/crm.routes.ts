import type { FastifyPluginAsync } from "fastify";
import { requireAuth } from "../../middleware/authenticate";
import { requireOrg } from "../../middleware/tenantScope";
import * as CrmService from "./crm.service";
import {
  createPipelineSchema,
  createDealSchema,
  updateDealStageSchema,
  createTaskSchema,
  createMeetingSchema
} from "./crm.schema";

export const crmRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("preHandler", requireAuth);
  fastify.addHook("preHandler", requireOrg);

  /**
   * GET /crm/pipelines
   */
  fastify.get("/pipelines", async (request, reply) => {
    const orgId = request.organizationId!;
    const workspace = await fastify.db.workspace.findFirst({ where: { organizationId: orgId } });
    
    const pipelines = await CrmService.listPipelines(fastify, orgId, workspace!.id);
    return reply.send(pipelines);
  });

  /**
   * POST /crm/pipelines
   */
  fastify.post("/pipelines", async (request, reply) => {
    const data = createPipelineSchema.parse(request.body);
    const orgId = request.organizationId!;
    const workspace = await fastify.db.workspace.findFirst({ where: { organizationId: orgId } });
    
    const pipeline = await CrmService.createPipeline(fastify, orgId, workspace!.id, data);
    return reply.status(201).send(pipeline);
  });

  /**
   * GET /crm/deals
   */
  fastify.get<{ Querystring: { pipelineId?: string } }>("/deals", async (request, reply) => {
    const { pipelineId } = request.query;
    const orgId = request.organizationId!;
    
    const deals = await CrmService.listDeals(fastify, orgId, pipelineId);
    return reply.send(deals);
  });

  /**
   * POST /crm/deals
   */
  fastify.post("/deals", async (request, reply) => {
    const data = createDealSchema.parse(request.body);
    const orgId = request.organizationId!;
    const userId = request.user!.id;

    const deal = await CrmService.createDeal(fastify, orgId, data, userId);
    return reply.status(201).send(deal);
  });

  /**
   * GET /crm/deals/:id
   */
  fastify.get<{ Params: { id: string } }>("/deals/:id", async (request, reply) => {
    const { id } = request.params;
    const orgId = request.organizationId!;
    
    const deal = await CrmService.getDeal(fastify, orgId, id);
    return reply.send(deal);
  });

  /**
   * PUT /crm/deals/:id/stage
   */
  fastify.put<{ Params: { id: string } }>("/deals/:id/stage", async (request, reply) => {
    const { id } = request.params;
    const { stage } = updateDealStageSchema.parse(request.body);
    const orgId = request.organizationId!;
    const userId = request.user!.id;
    
    const deal = await CrmService.updateDealStage(fastify, orgId, id, stage, userId);
    return reply.send(deal);
  });

  /**
   * POST /crm/deals/:id/tasks
   */
  fastify.post<{ Params: { id: string } }>("/deals/:id/tasks", async (request, reply) => {
    const { id } = request.params;
    const data = createTaskSchema.parse({ ...request.body as object, dealId: id });
    const orgId = request.organizationId!;
    
    const task = await CrmService.createTask(fastify, orgId, data);
    return reply.status(201).send(task);
  });

  /**
   * POST /crm/deals/:id/meetings
   */
  fastify.post<{ Params: { id: string } }>("/deals/:id/meetings", async (request, reply) => {
    const { id } = request.params;
    const data = createMeetingSchema.parse({ ...request.body as object, dealId: id });
    const orgId = request.organizationId!;
    
    const meeting = await CrmService.createMeeting(fastify, orgId, data);
    return reply.status(201).send(meeting);
  });
};
