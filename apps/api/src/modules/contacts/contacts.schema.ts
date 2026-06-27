import { z } from "zod";

export const createContactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  title: z.string().optional(),
  department: z.string().optional(),
  
  email: z.string().email("Must be a valid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  twitterUrl: z.string().url().optional().or(z.literal("")),
  avatarUrl: z.string().url().optional().or(z.literal("")),
  
  isDecisionMaker: z.boolean().default(false),
});

export const updateContactSchema = createContactSchema.partial();
