import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { SequencesService } from "./sequences.service";

export const sequenceRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  const service = new SequencesService(app);

  app.addHook("onRequest", async (req, reply) => {
    try {
      await (app as any).clerk.protect()(req, reply);
    } catch (err) {
      reply.code(401).send({ error: "Unauthorized" });
    }
  });

  app.post("/:campaignId/sequences", async (req: any, reply) => {
    const orgId = req.auth?.orgId || req.auth?.userId || "mock_org";
    const sequence = await service.createSequence(orgId, req.params.campaignId, req.body);
    return reply.status(201).send(sequence);
  });

  app.post("/:campaignId/sequences/:sequenceId/steps", async (req: any, reply) => {
    const orgId = req.auth?.orgId || req.auth?.userId || "mock_org";
    const step = await service.addSequenceStep(orgId, req.params.campaignId, req.params.sequenceId, req.body);
    return reply.status(201).send(step);
  });
  app.get("/:campaignId/sequences", async (req: any, reply) => {
    const orgId = req.auth?.orgId || req.auth?.userId || "mock_org";
    const sequences = await service.getSequences(orgId, req.params.campaignId);
    return reply.send(sequences);
  });

  app.put("/:campaignId/sequences/:sequenceId", async (req: any, reply) => {
    const orgId = req.auth?.orgId || req.auth?.userId || "mock_org";
    const sequence = await service.updateSequence(orgId, req.params.campaignId, req.params.sequenceId, req.body);
    return reply.send(sequence);
  });

  app.put("/:campaignId/sequences/:sequenceId/steps/:stepId", async (req: any, reply) => {
    const orgId = req.auth?.orgId || req.auth?.userId || "mock_org";
    const step = await service.updateSequenceStep(orgId, req.params.campaignId, req.params.sequenceId, req.params.stepId, req.body);
    return reply.send(step);
  });

  app.delete("/:campaignId/sequences/:sequenceId/steps/:stepId", async (req: any, reply) => {
    const orgId = req.auth?.orgId || req.auth?.userId || "mock_org";
    await service.deleteSequenceStep(orgId, req.params.campaignId, req.params.sequenceId, req.params.stepId);
    return reply.status(204).send();
  });
};
