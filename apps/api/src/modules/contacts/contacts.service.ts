import type { FastifyInstance } from "fastify";
import { AppError } from "../../shared/errors/AppError";

export async function listContacts(
  fastify: FastifyInstance,
  organizationId: string,
  leadId: string
) {
  // Ensure lead belongs to org
  const lead = await fastify.db.lead.findFirst({
    where: { id: leadId, organizationId }
  });

  if (!lead) {
    throw AppError.notFound("Lead");
  }

  const contacts = await fastify.db.contact.findMany({
    where: { leadId, organizationId },
    orderBy: { createdAt: "desc" }
  });

  return contacts;
}

export async function createContact(
  fastify: FastifyInstance,
  organizationId: string,
  leadId: string,
  data: any
) {
  const lead = await fastify.db.lead.findFirst({
    where: { id: leadId, organizationId }
  });

  if (!lead) {
    throw AppError.notFound("Lead");
  }

  const contact = await fastify.db.contact.create({
    data: {
      ...data,
      organizationId,
      leadId
    }
  });

  return contact;
}

export async function updateContact(
  fastify: FastifyInstance,
  organizationId: string,
  leadId: string,
  contactId: string,
  data: any
) {
  const contact = await fastify.db.contact.findFirst({
    where: { id: contactId, leadId, organizationId }
  });

  if (!contact) {
    throw AppError.notFound("Contact");
  }

  const updated = await fastify.db.contact.update({
    where: { id: contactId },
    data
  });

  return updated;
}

export async function deleteContact(
  fastify: FastifyInstance,
  organizationId: string,
  leadId: string,
  contactId: string
) {
  const contact = await fastify.db.contact.findFirst({
    where: { id: contactId, leadId, organizationId }
  });

  if (!contact) {
    throw AppError.notFound("Contact");
  }

  await fastify.db.contact.delete({
    where: { id: contactId }
  });

  return { success: true, id: contactId };
}
