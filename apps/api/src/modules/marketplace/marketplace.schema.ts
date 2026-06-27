import { z } from "zod";

export const publishTemplateSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  type: z.enum(["WORKFLOW", "EMAIL", "PROMPT"]),
  payload: z.any(), // the raw template JSON data
  isPublic: z.boolean().default(true),
});

export const importTemplateSchema = z.object({
  workspaceId: z.string(),
});
