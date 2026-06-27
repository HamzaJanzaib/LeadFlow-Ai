import { z } from "zod";
import { BaseTool } from "../BaseTool";

// Simple mock schema for MVP. Will be tied to the DB schema eventually.
const CreateLeadSchema = z.object({
  company: z.string().describe("Company name"),
  website: z.string().url().optional().describe("Company website URL"),
  industry: z.string().optional().describe("Company industry"),
  summary: z.string().optional().describe("AI generated summary of what the company does"),
  score: z.number().optional().describe("Initial AI estimated score (0-100)"),
});

export const createLeadTool = new BaseTool({
  name: "create_lead",
  description: "Saves a newly discovered company/lead into the CRM database.",
  schema: CreateLeadSchema,
  func: async (leadData) => {
    // TODO: Send to apps/api/src/modules/leads/leads.service.ts or directly to DB via Prisma
    console.log("[Mock Create Lead] Data:", leadData);
    
    return `Successfully created lead for ${leadData.company} with mock ID: lead_mock_12345`;
  },
});
