import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { AIService } from "./ai.service";

export class AIController {
  private aiService: AIService;

  constructor(app: FastifyInstance) {
    this.aiService = new AIService(app);
  }

  public async chat(req: FastifyRequest<{ Body: { message: string } }>, reply: FastifyReply) {
    const auth = (req as any).auth;
    const tenantId = auth?.orgId || auth?.userId || "anonymous";
    const result = await this.aiService.chat(req.body.message, tenantId);
    return reply.send(result);
  }

  public async plan(req: FastifyRequest<{ Body: { goal: string } }>, reply: FastifyReply) {
    const auth = (req as any).auth;
    const tenantId = auth?.orgId || auth?.userId || "anonymous";
    const result = await this.aiService.plan(req.body.goal, tenantId);
    return reply.send(result);
  }

  public async approvePlan(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const auth = (req as any).auth;
    const tenantId = auth?.orgId || auth?.userId || "anonymous";
    const result = await this.aiService.approvePlan(req.params.id, tenantId);
    return reply.send(result);
  }

  public async getRunStatus(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const auth = (req as any).auth;
    const tenantId = auth?.orgId || auth?.userId || "anonymous";
    const result = await this.aiService.getRunStatus(req.params.id, tenantId);
    return reply.send(result);
  }
}
