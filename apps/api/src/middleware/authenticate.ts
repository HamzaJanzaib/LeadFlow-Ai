import type { FastifyRequest, FastifyReply } from "fastify";
import { getAuth } from "@clerk/fastify";
import crypto from "crypto";
import { AppError } from "../shared/errors/AppError";

export const requireAuth = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  // 1. Check for API Key
  const apiKeyHeader = request.headers["x-api-key"] as string;
  if (apiKeyHeader) {
    const keyHash = crypto.createHash("sha256").update(apiKeyHeader).digest("hex");
    
    const apiKeyRecord = await request.server.db.apiKey.findUnique({
      where: { keyHash },
    });

    if (!apiKeyRecord) {
      throw AppError.unauthorized("Invalid API Key");
    }

    // Update last used timestamp (fire and forget)
    request.server.db.apiKey.update({
      where: { id: apiKeyRecord.id },
      data: { lastUsedAt: new Date() }
    }).catch(console.error);

    request.organizationId = apiKeyRecord.organizationId;
    return; // Authenticated via API Key
  }

  // 2. Check for Clerk JWT
  const { userId, orgId } = getAuth(request);

  if (!userId) {
    throw AppError.unauthorized("Authentication required");
  }

  // We map the clerk auth details to the request object for easy access downstream
  request.user = {
    id: userId,
  } as any;
  
  if (orgId) {
    request.organizationId = orgId;
  }
};
