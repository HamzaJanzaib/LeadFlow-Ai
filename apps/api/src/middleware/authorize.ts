import type { FastifyRequest, FastifyReply } from "fastify";
import { getAuth } from "@clerk/fastify";
import { AppError } from "../shared/errors/AppError";

type Role = "org:admin" | "org:member" | "org:viewer";

const ROLE_HIERARCHY: Record<Role, number> = {
  "org:admin": 3,
  "org:member": 2,
  "org:viewer": 1,
};

export const requireRole = (minimumRole: Role) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { orgRole } = getAuth(request);

    if (!orgRole) {
      throw AppError.forbidden(
        "You do not have a role in the current organization"
      );
    }

    const userRoleLevel = ROLE_HIERARCHY[orgRole as Role] ?? 0;
    const requiredRoleLevel = ROLE_HIERARCHY[minimumRole];

    if (userRoleLevel < requiredRoleLevel) {
      throw AppError.forbidden(
        `Insufficient permissions. Requires at least ${minimumRole}`
      );
    }
  };
};
