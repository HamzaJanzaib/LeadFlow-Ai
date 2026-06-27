import type { FastifyInstance } from "fastify";
import { AppError } from "../../shared/errors/AppError";

/**
 * Creates a new organization and default workspace.
 * Also adds the creator as the OWNER.
 */
export async function createOrganization(
  fastify: FastifyInstance,
  userId: string,
  data: { name: string; slug: string; industry?: string | undefined }
) {
  const existingOrg = await fastify.db.organization.findUnique({
    where: { slug: data.slug },
  });

  if (existingOrg) {
    throw AppError.conflict("Organization slug is already taken");
  }

  // Use a transaction to ensure atomic creation
  return await fastify.db.$transaction(async (tx: any) => {
    // 1. Create Organization
    const org = await tx.organization.create({
      data: {
        name: data.name,
        slug: data.slug,
        industry: data.industry,
      },
    });

    // 2. Create Default Workspace
    const workspace = await tx.workspace.create({
      data: {
        organizationId: org.id,
        name: "General",
        slug: "general",
      },
    });

    // 3. Add Creator as Owner
    await tx.teamMember.create({
      data: {
        organizationId: org.id,
        userId: userId,
        role: "OWNER",
        workspaceId: workspace.id,
      },
    });

    return { org, workspace };
  });
}

/**
 * Gets an organization by ID, validating the user is a member
 */
export async function getOrganizationById(
  fastify: FastifyInstance,
  userId: string,
  orgId: string
) {
  // In a real implementation with Clerk, you might rely on Clerk's token 
  // claims for org membership. But we double check the DB here.
  const membership = await fastify.db.teamMember.findFirst({
    where: { organizationId: orgId, userId },
  });

  if (!membership) {
    throw new AppError("Organization not found or access denied", 404, "NOT_FOUND");
  }

  return await fastify.db.organization.findUnique({
    where: { id: orgId },
    include: {
      workspaces: true,
    }
  });
}
