import type { FastifyPluginAsync } from "fastify";
import { requireAuth } from "../../middleware/authenticate";
import { requireOrg } from "../../middleware/tenantScope";
import * as ContactService from "./contacts.service";
import { createContactSchema, updateContactSchema } from "./contacts.schema";

export const contactsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("preHandler", requireAuth);
  fastify.addHook("preHandler", requireOrg);

  /**
   * GET /leads/:leadId/contacts
   */
  fastify.get<{ Params: { leadId: string } }>(
    "/leads/:leadId/contacts",
    async (request, reply) => {
      const { leadId } = request.params;
      const orgId = request.organizationId!;

      const contacts = await ContactService.listContacts(fastify, orgId, leadId);
      return reply.send(contacts);
    }
  );

  /**
   * POST /leads/:leadId/contacts
   */
  fastify.post<{ Params: { leadId: string } }>(
    "/leads/:leadId/contacts",
    async (request, reply) => {
      const { leadId } = request.params;
      const data = createContactSchema.parse(request.body);
      const orgId = request.organizationId!;

      const contact = await ContactService.createContact(fastify, orgId, leadId, data);
      return reply.status(201).send(contact);
    }
  );

  /**
   * PUT /leads/:leadId/contacts/:contactId
   */
  fastify.put<{ Params: { leadId: string; contactId: string } }>(
    "/leads/:leadId/contacts/:contactId",
    async (request, reply) => {
      const { leadId, contactId } = request.params;
      const data = updateContactSchema.parse(request.body);
      const orgId = request.organizationId!;

      const contact = await ContactService.updateContact(fastify, orgId, leadId, contactId, data);
      return reply.send(contact);
    }
  );

  /**
   * DELETE /leads/:leadId/contacts/:contactId
   */
  fastify.delete<{ Params: { leadId: string; contactId: string } }>(
    "/leads/:leadId/contacts/:contactId",
    async (request, reply) => {
      const { leadId, contactId } = request.params;
      const orgId = request.organizationId!;

      const result = await ContactService.deleteContact(fastify, orgId, leadId, contactId);
      return reply.send(result);
    }
  );
};
