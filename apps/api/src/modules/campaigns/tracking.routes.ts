import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { TrackingService } from "./tracking.service";

export const trackingRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  const service = new TrackingService(app);

  // 1x1 Transparent GIF
  const pixel = Buffer.from(
    "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
    "base64"
  );

  app.get("/open/:eventId", async (req: any, reply) => {
    // Fire and forget tracking
    service.trackOpen(
      req.params.eventId,
      req.headers["user-agent"] || "",
      req.ip
    ).catch(err => app.log.error(err));

    reply.header("Content-Type", "image/gif");
    reply.header("Cache-Control", "no-cache, no-store, must-revalidate");
    return reply.send(pixel);
  });

  app.get("/click/:eventId", async (req: any, reply) => {
    const targetUrl = req.query.url;
    if (!targetUrl) return reply.status(400).send("URL required");

    service.trackClick(
      req.params.eventId,
      targetUrl,
      req.headers["user-agent"] || "",
      req.ip
    ).catch(err => app.log.error(err));

    return reply.redirect(targetUrl);
  });

  app.post("/webhooks/reply", async (req: any, reply) => {
    // For e.g. SendGrid or Resend inbound webhook
    const { From, TextBody } = req.body;
    if (From) {
      await service.handleReply(From, TextBody || "");
    }
    return reply.status(200).send("OK");
  });
};
