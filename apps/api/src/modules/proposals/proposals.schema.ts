import { z } from "zod";

export const generateProposalSchema = z.object({
  dealId: z.string().min(1),
  title: z.string().min(1),
});

export const updateProposalSchema = z.object({
  title: z.string().optional(),
  executiveSummary: z.string().optional(),
  scopeOfWork: z.string().optional(),
  timeline: z.any().optional(), // Could be more strictly typed JSON
  pricing: z.any().optional(),
  terms: z.string().optional(),
  totalValue: z.number().optional(),
  currency: z.string().optional(),
  validUntil: z.string().datetime().optional(),
  status: z.enum(["draft", "sent", "viewed", "accepted", "rejected"]).optional(),
});
