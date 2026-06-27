import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { CampaignsService } from "./campaigns.service";
import { z } from "zod";
import { CampaignChannel } from "@leadflow/db";

export const campaignRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  const service = new CampaignsService(app);

  app.addHook("onRequest", async (req, reply) => {
    try {
      await (app as any).clerk.protect()(req, reply);
    } catch (err) {
      reply.code(401).send({ error: "Unauthorized" });
    }
  });

  app.post("/", {
    schema: {
      body: {
        type: "object",
        properties: {
          name: { type: "string" },
          channel: { type: "string", enum: Object.values(CampaignChannel) },
          fromEmail: { type: "string" }
        },
        required: ["name", "channel"]
      }
    }
  }, async (req: any, reply) => {
    const orgId = req.auth?.orgId || req.auth?.userId || "mock_org";
    const campaign = await service.createCampaign(orgId, req.body);
    return reply.status(201).send(campaign);
  });

  app.get("/", async (req: any, reply) => {
    const orgId = req.auth?.orgId || req.auth?.userId || "mock_org";
    const campaigns = await service.getCampaigns(orgId);
    return reply.send(campaigns);
  });

  app.get("/:id", async (req: any, reply) => {
    const orgId = req.auth?.orgId || req.auth?.userId || "mock_org";
    const campaign = await service.getCampaign(orgId, req.params.id);
    return reply.send(campaign);
  });

  app.post("/:id/launch", async (req: any, reply) => {
    const orgId = req.auth?.orgId || req.auth?.userId || "mock_org";
    const campaign = await service.launchCampaign(orgId, req.params.id);
    return reply.send(campaign);
  });

  app.post("/:id/pause", async (req: any, reply) => {
    const orgId = req.auth?.orgId || req.auth?.userId || "mock_org";
    const campaign = await service.pauseCampaign(orgId, req.params.id);
    return reply.send(campaign);
  });

  app.put("/:id", {
    schema: {
      body: {
        type: "object",
        properties: {
          name: { type: "string" },
          fromEmail: { type: "string" }
        }
      }
    }
  }, async (req: any, reply) => {
    const orgId = req.auth?.orgId || req.auth?.userId || "mock_org";
    const campaign = await service.updateCampaign(orgId, req.params.id, req.body);
    return reply.send(campaign);
  });

  app.get("/:id/leads", async (req: any, reply) => {
    const orgId = req.auth?.orgId || req.auth?.userId || "mock_org";
    const leads = await service.getCampaignLeads(orgId, req.params.id);
    return reply.send(leads);
  });

  app.post("/:id/leads", {
    schema: {
      body: {
        type: "object",
        properties: {
          leadId: { type: "string" }
        },
        required: ["leadId"]
      }
    }
  }, async (req: any, reply) => {
    const orgId = req.auth?.orgId || req.auth?.userId || "mock_org";
    const result = await service.addLeadToCampaign(orgId, req.params.id, req.body.leadId);
    return reply.status(201).send(result);
  });
};
