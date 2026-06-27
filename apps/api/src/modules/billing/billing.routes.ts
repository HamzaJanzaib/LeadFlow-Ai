import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { requireAuth } from "../../middleware/authenticate";
import { requireOrg } from "../../middleware/tenantScope";
import * as BillingService from "./billing.service";

const checkoutSchema = z.object({
  priceId: z.string(),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
});

export const billingRoutes: FastifyPluginAsync = async (fastify) => {
  /**
   * POST /billing/checkout
   * Create a Stripe checkout session for subscription upgrades
   */
  fastify.post(
    "/checkout",
    { preHandler: [requireAuth, requireOrg] },
    async (request, reply) => {
      const data = checkoutSchema.parse(request.body);
      const organizationId = request.organizationId!;

      const session = await BillingService.createCheckoutSession(
        fastify,
        organizationId,
        data.priceId,
        data.successUrl,
        data.cancelUrl
      );

      return reply.send(session);
    }
  );

  /**
   * POST /billing/webhook
   * Stripe webhook receiver
   */
  fastify.post(
    "/webhook",
    {
      config: {
        rawBody: true, // Need raw body for Stripe signature verification
      },
    },
    async (request, reply) => {
      const signature = request.headers["stripe-signature"];

      if (!signature || typeof signature !== "string") {
        return reply.status(400).send({ error: "Missing Stripe signature" });
      }

      // Fastify multipart or body parser must preserve raw body.
      // Assuming fastify is configured to keep raw body as a string or buffer.
      const payload = (request as any).rawBody || JSON.stringify(request.body);

      const result = await BillingService.handleWebhook(fastify, payload, signature);
      return reply.send(result);
    }
  );
};
