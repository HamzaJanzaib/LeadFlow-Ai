import { FastifyPluginAsync } from "fastify";
import { AnalyticsService } from "./analytics.service";
import { AppError } from "../../shared/errors/AppError";

export const analyticsRoutes: FastifyPluginAsync = async (app) => {
  const analyticsService = new AnalyticsService(app.db, app.redis);

  app.addHook("preHandler", async (request) => {
    if (!request.user) {
      throw new AppError("Unauthorized", 401);
    }
  });

  app.get("/overview", async (request, reply) => {
    const orgId = request.headers["x-organization-id"] as string;
    
    if (!orgId) {
      throw new AppError("x-organization-id header is required", 400);
    }

    // Verify user belongs to org
    const membership = await app.db.teamMember.findFirst({
      where: {
        workspace: { organizationId: orgId },
        userId: request.user!.id,
      },
    });

    if (!membership) {
      throw new AppError("Forbidden", 403);
    }

    const overview = await analyticsService.getOverview(orgId);
    return reply.send(overview);
  });
};
