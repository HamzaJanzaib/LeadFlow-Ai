import { FastifyPluginAsync } from "fastify";
import { requireAuth } from "../../middleware/authenticate";
import { publishTemplateSchema, importTemplateSchema } from "./marketplace.schema";
import { MarketplaceService } from "./marketplace.service";

export const marketplaceRoutes: FastifyPluginAsync = async (fastify) => {
  const marketplaceService = new MarketplaceService(fastify.db);

  fastify.addHook("preHandler", requireAuth);

  // GET /api/v1/marketplace/templates - List all curated templates
  fastify.get("/templates", async (request, reply) => {
    const templates = await marketplaceService.listTemplates();
    return reply.status(200).send({ data: templates });
  });

  // POST /api/v1/marketplace/templates - Publish a new template
  fastify.post("/templates", async (request, reply) => {
    const orgId = request.user!.organizationId;
    const body = publishTemplateSchema.parse(request.body);

    const result = await marketplaceService.publishTemplate(orgId, body);
    
    return reply.status(201).send(result);
  });

  // POST /api/v1/marketplace/templates/:id/import - Import template into workspace
  fastify.post("/templates/:id/import", async (request, reply) => {
    const orgId = request.user!.organizationId;
    const { id } = request.params as { id: string };
    const body = importTemplateSchema.parse(request.body);

    const result = await marketplaceService.importTemplate(orgId, id, body.workspaceId);
    
    return reply.status(200).send(result);
  });
};
