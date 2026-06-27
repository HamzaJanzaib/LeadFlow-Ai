import type { FastifyRequest, FastifyReply } from "fastify";
import { AppError } from "../shared/errors/AppError";

/**
 * Ensures that the request is bound to a specific organization context.
 * Used for routes that require an active organization (e.g., getting leads).
 */
export const requireOrg = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  if (!request.organizationId) {
    throw AppError.forbidden(
      "This action requires an active organization context. Please select an organization."
    );
  }
};

/**
 * Tenant scoping utility for Prisma queries.
 * Usage: prisma.lead.findMany({ where: { ...withTenant(request) } })
 */
export const withTenant = (request: FastifyRequest) => {
  if (!request.organizationId) {
    throw new Error("Attempted to scope query to tenant, but no organizationId found in request");
  }
  return { organizationId: request.organizationId };
};
