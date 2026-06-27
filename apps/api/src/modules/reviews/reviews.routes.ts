import { FastifyPluginAsync } from "fastify";
import { requireAuth } from "../../middleware/authenticate";
import { requestReviewSchema, createReferralSchema } from "./reviews.schema";
import { ReviewsService } from "./reviews.service";

export const reviewsRoutes: FastifyPluginAsync = async (fastify) => {
  const reviewsService = new ReviewsService(fastify.db);

  fastify.addHook("preHandler", requireAuth);

  // POST /api/v1/reviews/request - send review request email
  fastify.post("/request", async (request, reply) => {
    const orgId = request.user!.organizationId;
    const body = requestReviewSchema.parse(request.body);

    const result = await reviewsService.requestReview(
      orgId, 
      body.clientEmail, 
      body.clientName, 
      body.dealId, 
      body.customMessage
    );

    return reply.status(200).send(result);
  });

  // POST /api/v1/reviews/referrals - create referral campaign
  fastify.post("/referrals", async (request, reply) => {
    const orgId = request.user!.organizationId;
    const body = createReferralSchema.parse(request.body);

    const campaign = await reviewsService.createReferralCampaign(orgId, body);
    
    return reply.status(201).send(campaign);
  });

  // GET /api/v1/reviews/referrals - list referrals
  fastify.get("/referrals", async (request, reply) => {
    const orgId = request.user!.organizationId;
    const referrals = await reviewsService.getReferrals(orgId);
    
    return reply.status(200).send({ data: referrals });
  });

  // POST /api/v1/reviews/referrals/:code/track - track referral conversion
  // Using POST here because tracking implies creating a record of conversion
  fastify.post("/referrals/:code/track", async (request, reply) => {
    const orgId = request.user!.organizationId;
    const { code } = request.params as { code: string };

    const result = await reviewsService.trackReferralConversion(orgId, code);
    
    return reply.status(200).send(result);
  });
};
