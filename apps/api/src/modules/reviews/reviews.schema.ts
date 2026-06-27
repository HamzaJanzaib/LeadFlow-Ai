import { z } from "zod";

export const requestReviewSchema = z.object({
  dealId: z.string().optional(),
  clientEmail: z.string().email(),
  clientName: z.string().min(2),
  customMessage: z.string().optional(),
});

export const createReferralSchema = z.object({
  campaignName: z.string().min(3),
  rewardAmount: z.number().positive(),
  currency: z.string().default("USD"),
  maxReferrals: z.number().int().positive().optional(),
});
