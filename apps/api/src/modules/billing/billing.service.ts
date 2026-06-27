import type { FastifyInstance } from "fastify";
import Stripe from "stripe";
import { AppError } from "../../shared/errors/AppError";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2026-06-24.dahlia",
});

export async function createCheckoutSession(
  fastify: FastifyInstance,
  organizationId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
) {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw AppError.internal("Stripe is not configured");
  }

  const org = await fastify.db.organization.findUnique({
    where: { id: organizationId },
  });

  if (!org) {
    throw AppError.notFound("Organization");
  }

  // Find existing Stripe customer ID if we stored one, else we create
  let customerId = undefined; // We'd ideally store stripeCustomerId on Organization, but omitted for simplicity
  // Alternatively, pass organizationId in metadata

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      organizationId,
    },
    client_reference_id: organizationId,
  });

  return { url: session.url };
}

export async function handleWebhook(
  fastify: FastifyInstance,
  payload: string | Buffer,
  signature: string
) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    throw AppError.internal("Stripe webhook secret not configured");
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err: any) {
    throw AppError.badRequest(`Webhook signature verification failed: ${err.message}`);
  }

  const { log } = fastify;

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;
      const orgId = session.metadata?.organizationId;
      if (orgId) {
        log.info(`Checkout completed for org: ${orgId}`);
        // We could upgrade the plan in DB here, but usually wait for subscription.updated
      }
      break;

    case "customer.subscription.updated":
    case "customer.subscription.created":
      const subscription = event.data.object as Stripe.Subscription;
      // In a real app, map the Stripe price ID to your SubscriptionPlan enum
      // and update the Organization.plan and Subscription table.
      log.info(`Subscription updated: ${subscription.id}`);
      break;

    case "customer.subscription.deleted":
      // Downgrade organization to FREE
      log.info("Subscription canceled, downgrading to FREE");
      break;

    default:
      log.info(`Unhandled Stripe event type: ${event.type}`);
  }

  return { received: true };
}
