import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import crypto from "crypto";
import { requireAuth } from "../../middleware/authenticate";
import { requireRole } from "../../middleware/authorize";
import { requireOrg } from "../../middleware/tenantScope";
import { logEvent } from "../../shared/utils/auditLog";

const createApiKeySchema = z.object({
  name: z.string().min(2),
  scopes: z.array(z.string()).default([]),
});

export const apiKeyRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("preHandler", requireAuth);
  fastify.addHook("preHandler", requireOrg);

  /**
   * POST /api-keys
   * Create a new API key (Admin only)
   */
  fastify.post(
    "/",
    { preHandler: [requireRole("org:admin")] },
    async (request, reply) => {
      const data = createApiKeySchema.parse(request.body);
      const organizationId = request.organizationId!;

      // Generate a secure random API key
      const keyBuffer = crypto.randomBytes(32);
      const rawKey = `lf_${keyBuffer.toString("hex")}`;
      
      // Hash the key for storage
      const keyHash = crypto.createHash("sha256").update(rawKey).digest("hex");
      const keyPrefix = rawKey.substring(0, 11); // 'lf_' + 8 chars

      const apiKey = await fastify.db.apiKey.create({
        data: {
          organizationId,
          name: data.name,
          keyHash,
          keyPrefix,
          scopes: data.scopes,
        },
      });

      await logEvent(request, "api_key.created", "api_key", apiKey.id, { name: apiKey.name });

      // Return the RAW key ONLY ONCE. It cannot be retrieved again.
      return reply.status(201).send({
        id: apiKey.id,
        name: apiKey.name,
        keyPrefix: apiKey.keyPrefix,
        scopes: apiKey.scopes,
        createdAt: apiKey.createdAt,
        key: rawKey, // Important: Send raw key only once
      });
    }
  );

  /**
   * GET /api-keys
   * List all API keys for the organization
   */
  fastify.get(
    "/",
    { preHandler: [requireRole("org:admin")] },
    async (request, reply) => {
      const organizationId = request.organizationId!;

      const keys = await fastify.db.apiKey.findMany({
        where: { organizationId },
        select: {
          id: true,
          name: true,
          keyPrefix: true,
          scopes: true,
          createdAt: true,
          lastUsedAt: true,
        },
      });

      return reply.send(keys);
    }
  );

  /**
   * DELETE /api-keys/:id
   * Revoke an API key
   */
  fastify.delete(
    "/:id",
    { preHandler: [requireRole("org:admin")] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const organizationId = request.organizationId!;

      // Ensure key belongs to this org
      await fastify.db.apiKey.delete({
        where: { id, organizationId },
      });

      await logEvent(request, "api_key.revoked", "api_key", id);

      return reply.send({ success: true });
    }
  );
};
