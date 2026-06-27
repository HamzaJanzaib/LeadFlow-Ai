import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { requireAuth } from "../../middleware/authenticate";
import { requireRole } from "../../middleware/authorize";
import { requireOrg } from "../../middleware/tenantScope";
import { logEvent } from "../../shared/utils/auditLog";
import * as OrgService from "./organizations.service";

// Schemas
const createOrgSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric and hyphens only"),
  industry: z.string().optional(),
});

export const orgRoutes: FastifyPluginAsync = async (fastify) => {
  // All org routes require authentication
  fastify.addHook("preHandler", requireAuth);

  /**
   * POST /organizations
   * Create a new organization and default workspace
   */
  fastify.post("/", async (request, reply) => {
    const data = createOrgSchema.parse(request.body);
    const userId = request.user!.id;

    const result = await OrgService.createOrganization(fastify, userId, data);

    // Set organizationId for the audit log context manually since it was just created
    request.organizationId = result.org.id;
    await logEvent(request, "organization.created", "organization", result.org.id, {
      name: data.name,
      slug: data.slug,
    });

    return reply.status(201).send(result);
  });

  /**
   * GET /organizations/me
   * Get the active organization's details (requires tenant context)
   */
  fastify.get(
    "/me",
    { preHandler: [requireOrg] },
    async (request, reply) => {
      const orgId = request.organizationId!;
      const userId = request.user!.id;

      const org = await OrgService.getOrganizationById(fastify, userId, orgId);
      return reply.send(org);
    }
  );

  /**
   * GET /organizations/me/members
   * Only admins can view member details for the current org
   */
  fastify.get(
    "/me/members",
    { preHandler: [requireOrg, requireRole("org:admin")] },
    async (request, reply) => {
      const orgId = request.organizationId!;
      const members = await fastify.db.teamMember.findMany({
        where: { organizationId: orgId },
        include: { user: { select: { id: true, email: true, name: true } } },
      });
      return reply.send(members);
    }
  );
};
