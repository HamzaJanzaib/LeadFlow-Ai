import { FastifyPluginAsync } from "fastify";
import { WorkflowsService } from "./workflows.service";
import { AppError } from "../../shared/errors/AppError";
import { WorkflowStatus } from "@leadflow/db";
import { z } from "zod";

const workflowSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  triggerType: z.string(),
  triggerConfig: z.record(z.any()).optional(),
  nodes: z.array(z.record(z.any())).optional(),
  edges: z.array(z.record(z.any())).optional(),
});

export const workflowsRoutes: FastifyPluginAsync = async (app) => {
  const workflowsService = new WorkflowsService(app.db);

  app.addHook("preHandler", async (request) => {
    if (!request.user) {
      throw new AppError("Unauthorized", 401);
    }
  });

  // GET /workflows
  app.get("/", async (request, reply) => {
    const orgId = request.headers["x-organization-id"] as string;
    if (!orgId) throw new AppError("x-organization-id header required", 400);

    const workflows = await workflowsService.getWorkflows(orgId);
    return reply.send(workflows);
  });

  // GET /workflows/:id
  app.get<{ Params: { id: string } }>("/:id", async (request, reply) => {
    const orgId = request.headers["x-organization-id"] as string;
    const { id } = request.params;
    
    const workflow = await workflowsService.getWorkflowById(orgId, id);
    return reply.send(workflow);
  });

  // POST /workflows
  app.post<{ Body: any }>("/", async (request, reply) => {
    const orgId = request.headers["x-organization-id"] as string;
    const workspaceId = request.headers["x-workspace-id"] as string;
    if (!orgId || !workspaceId) throw new AppError("Headers missing", 400);

    const data = workflowSchema.parse(request.body);
    const workflow = await workflowsService.createWorkflow(orgId, workspaceId, data);
    return reply.status(201).send(workflow);
  });

  // PUT /workflows/:id
  app.put<{ Params: { id: string }, Body: any }>("/:id", async (request, reply) => {
    const orgId = request.headers["x-organization-id"] as string;
    const { id } = request.params;
    
    const data = workflowSchema.parse(request.body);
    const workflow = await workflowsService.updateWorkflow(orgId, id, data);
    return reply.send(workflow);
  });

  // POST /workflows/:id/activate
  app.post<{ Params: { id: string } }>("/:id/activate", async (request, reply) => {
    const orgId = request.headers["x-organization-id"] as string;
    const { id } = request.params;
    
    const workflow = await workflowsService.setWorkflowStatus(orgId, id, WorkflowStatus.ACTIVE);
    return reply.send(workflow);
  });

  // POST /workflows/:id/pause
  app.post<{ Params: { id: string } }>("/:id/pause", async (request, reply) => {
    const orgId = request.headers["x-organization-id"] as string;
    const { id } = request.params;
    
    const workflow = await workflowsService.setWorkflowStatus(orgId, id, WorkflowStatus.PAUSED);
    return reply.send(workflow);
  });
};
