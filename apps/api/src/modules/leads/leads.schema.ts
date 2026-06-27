import { z } from "zod";
import { LeadStatus, LeadSource } from "@leadflow/db";

export const createLeadSchema = z.object({
  company: z.string().min(2, "Company name must be at least 2 characters"),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  industry: z.string().optional(),
  employees: z.number().int().positive().optional(),
  revenue: z.number().positive().optional(),
  description: z.string().optional(),
  
  email: z.string().email("Must be a valid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  twitterUrl: z.string().url().optional().or(z.literal("")),
  
  source: z.nativeEnum(LeadSource).default(LeadSource.MANUAL),
  tags: z.array(z.string()).default([]),
  customFields: z.record(z.any()).optional(),
});

export const updateLeadSchema = createLeadSchema.partial().extend({
  status: z.nativeEnum(LeadStatus).optional(),
  ownerId: z.string().uuid().optional().or(z.null()), // Can assign or unassign
});

export const getLeadsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  search: z.string().optional(),
  status: z.nativeEnum(LeadStatus).optional(),
  source: z.nativeEnum(LeadSource).optional(),
  sortBy: z.enum(["createdAt", "score", "company"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const bulkActionSchema = z.object({
  leadIds: z.array(z.string()).min(1),
  action: z.enum(["update_status", "assign", "delete", "add_tags"]),
  // Action specific payloads
  status: z.nativeEnum(LeadStatus).optional(),
  ownerId: z.string().optional(),
  tags: z.array(z.string()).optional(),
});
