import { FastifyInstance } from "fastify";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/fastify";

export async function clerkWebhookRoutes(app: FastifyInstance) {
  app.post(
    "/clerk",
    {
      config: {
        rawBody: true, // Need raw body for svix verification
      },
    },
    async (request, reply) => {
      const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

      if (!WEBHOOK_SECRET) {
        throw new Error("Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local");
      }

      const headers = request.headers;
      const payload = request.rawBody as string;

      const svix_id = headers["svix-id"] as string;
      const svix_timestamp = headers["svix-timestamp"] as string;
      const svix_signature = headers["svix-signature"] as string;

      if (!svix_id || !svix_timestamp || !svix_signature) {
        return reply.status(400).send("Error occured -- no svix headers");
      }

      const wh = new Webhook(WEBHOOK_SECRET);
      let evt: WebhookEvent;

      try {
        evt = wh.verify(payload, {
          "svix-id": svix_id,
          "svix-timestamp": svix_timestamp,
          "svix-signature": svix_signature,
        }) as WebhookEvent;
      } catch (err) {
        app.log.error({ err }, "Error verifying webhook:");
        return reply.status(400).send("Error occured");
      }

      const { id } = evt.data;
      const eventType = evt.type;

      app.log.info(`Webhook with and ID of ${id} and type of ${eventType}`);

      if (eventType === "user.created" || eventType === "user.updated") {
        const { email_addresses, primary_email_address_id, first_name, last_name, image_url } = evt.data;
        const emailObject = email_addresses?.find((email) => email.id === primary_email_address_id);
        
        if (emailObject) {
           await app.db.user.upsert({
            where: { clerkUserId: id as string },
            update: {
              email: emailObject.email_address,
              name: `${first_name || ""} ${last_name || ""}`.trim() || "Unknown",
              avatarUrl: image_url,
            },
            create: {
              clerkUserId: id as string,
              email: emailObject.email_address,
              name: `${first_name || ""} ${last_name || ""}`.trim() || "Unknown",
              avatarUrl: image_url,
              organizationId: "placeholder", // In a real flow, they create an org after signup
            },
          });
        }
      }

      if (eventType === "organization.created" || eventType === "organization.updated") {
        const { name, slug, image_url, created_by } = evt.data;
        
        const org = await app.db.organization.upsert({
          where: { clerkOrgId: id as string },
          update: {
            name,
            slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
            logoUrl: image_url ?? null,
          },
          create: {
            clerkOrgId: id as string,
            name,
            slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
            logoUrl: image_url ?? null,
          },
        });

        // Also add the user who created it as the owner
        if (created_by && eventType === "organization.created") {
           const user = await app.db.user.findUnique({ where: { clerkUserId: created_by }});
           if (user) {
             // Link the user to this organization
             await app.db.user.update({
               where: { id: user.id },
               data: { organizationId: org.id, role: "OWNER" }
             });
           }
        }
      }

      return reply.status(200).send({ success: true });
    }
  );
}
