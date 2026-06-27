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
};
