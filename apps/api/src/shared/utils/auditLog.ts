import type { FastifyRequest } from "fastify";

/**
 * Creates an audit log entry for significant actions.
 */
export async function logEvent(
  request: FastifyRequest,
  action: string,
  resource: string,
  resourceId?: string,
  payload?: any
) {
  const { db, log } = request.server;
  const organizationId = request.organizationId;
  const userId = request.user?.id;

  if (!organizationId) {
    log.warn(
      { action, resource, userId },
      "Attempted to audit log without an organization context. Skipping."
    );
    return;
  }

  try {
    await db.auditLog.create({
      data: {
        organizationId,
        userId: userId ?? null,
        action,
        resource,
        resourceId: resourceId ?? null,
        payload,
        ipAddress: request.ip,
        userAgent: request.headers["user-agent"] ?? null,
      },
    });
  } catch (error) {
    // We don't throw here to avoid failing the main request due to logging errors
    log.error({ error, action, resource }, "Failed to write audit log");
  }
}
