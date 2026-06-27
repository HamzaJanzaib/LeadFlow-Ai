import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import multipart from "@fastify/multipart";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import rawBody from "fastify-raw-body";

import { prismaPlugin } from "./plugins/prisma";
import { redisPlugin } from "./plugins/redis";
import clerkPlugin from "./plugins/clerk";
import { errorHandler } from "./shared/errors/errorHandler";
import { healthRoutes } from "./modules/health/health.routes";
import { clerkWebhookRoutes } from "./modules/webhooks/clerk.routes";
import { orgRoutes } from "./modules/organizations/organizations.routes";
import { apiKeyRoutes } from "./modules/api-keys/api-keys.routes";
import { billingRoutes } from "./modules/billing/billing.routes";
import { leadsRoutes } from "./modules/leads/leads.routes";
import { contactsRoutes } from "./modules/contacts/contacts.routes";
import { crmRoutes } from "./modules/crm/crm.routes";
import { aiRoutes } from "./modules/ai/ai.routes";

export async function buildServer() {
  const app = Fastify({
    logger: process.env.NODE_ENV === "development"
      ? {
          level: process.env.LOG_LEVEL ?? "info",
          transport: { target: "pino-pretty", options: { colorize: true } },
        }
      : {
          level: process.env.LOG_LEVEL ?? "info",
        },
    trustProxy: true,
    ajv: {
      customOptions: {
        coerceTypes: "array",
        useDefaults: true,
        removeAdditional: "all",
      },
    },
  });

  // ── Security ────────────────────────────────────────────────────────────────
  await app.register(helmet, {
    contentSecurityPolicy: false, // Disable for API
  });

  await app.register(cors, {
    origin: [
      process.env.APP_URL ?? "http://localhost:3000",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-API-Key"],
    credentials: true,
  });

  await app.register(rateLimit, {
    max: parseInt(process.env.RATE_LIMIT_MAX ?? "100"),
    timeWindow: parseInt(process.env.RATE_LIMIT_WINDOW_MS ?? "60000"),
    redis: undefined, // Will use Redis once plugin is registered
    keyGenerator: (req) => {
      const userId = (req as any).user?.id;
      return userId ?? req.ip;
    },
  });

  // ── File Uploads & Raw Body ──────────────────────────────────────────────
  await app.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
      files: 5,
    },
  });

  await app.register(rawBody, {
    field: "rawBody",
    global: false,
    encoding: "utf8",
    runFirst: true,
    routes: ["/billing/webhook"],
  });

  // ── OpenAPI Docs ─────────────────────────────────────────────────────────
  await app.register(swagger, {
    openapi: {
      openapi: "3.0.0",
      info: {
        title: "LeadFlow AI API",
        description: "AI-powered lead generation and sales automation platform API",
        version: "1.0.0",
      },
      servers: [
        {
          url: process.env.API_URL ?? "http://localhost:4000",
          description: "Development server",
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
          apiKey: {
            type: "apiKey",
            in: "header",
            name: "X-API-Key",
          },
        },
      },
      security: [{ bearerAuth: [] }],
    },
  });

  await app.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      deepLinking: false,
    },
  });

  // ── Database & Cache Plugins ─────────────────────────────────────────────
  await app.register(prismaPlugin);
  await app.register(redisPlugin);
  await app.register(clerkPlugin);

  // ── Error Handler ────────────────────────────────────────────────────────
  app.setErrorHandler(errorHandler);

  // ── Routes ───────────────────────────────────────────────────────────────
  await app.register(healthRoutes, { prefix: "/" });
  await app.register(orgRoutes, { prefix: "/organizations" });
  await app.register(apiKeyRoutes, { prefix: "/api-keys" });
  await app.register(billingRoutes, { prefix: "/billing" });

  // Future modules registered here:
  // await app.register(authRoutes, { prefix: "/auth" });
  // await app.register(orgRoutes, { prefix: "/organizations" });
  await app.register(leadsRoutes, { prefix: "/leads" });
  await app.register(contactsRoutes, { prefix: "/" }); // contacts routes already have /leads/:leadId in their path
  await app.register(crmRoutes, { prefix: "/crm" });
  await app.register(clerkWebhookRoutes, { prefix: "/webhooks" });
  // await app.register(campaignRoutes, { prefix: "/campaigns" });
  await app.register(aiRoutes, { prefix: "/ai" });
  // await app.register(analyticsRoutes, { prefix: "/analytics" });
  // await app.register(billingRoutes, { prefix: "/billing" });

  return app;
}
