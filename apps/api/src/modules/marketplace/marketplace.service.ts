import { FastifyInstance } from "fastify";
import { AppError } from "../../shared/errors/AppError";

const mockTemplates = [
  {
    id: "tpl_1",
    name: "Cold Outreach B2B",
    description: "A highly converting 4-step email sequence tailored for SaaS founders.",
    type: "EMAIL",
    author: "LeadFlow Official",
    installs: 1420,
    rating: 4.8,
    createdAt: new Date("2025-10-01"),
    payload: { steps: 4, intervals: [2, 3, 5] },
  },
  {
    id: "tpl_2",
    name: "Lead Scoring (SaaS)",
    description: "Automated workflow to qualify leads based on intent signals and tech stack.",
    type: "WORKFLOW",
    author: "Acme Agency",
    installs: 890,
    rating: 4.9,
    createdAt: new Date("2026-01-15"),
    payload: { rules: 12, triggers: ["site_visit", "form_submit"] },
  },
  {
    id: "tpl_3",
    name: "Meeting Summarizer",
    description: "AI prompt to extract action items and next steps from a sales call transcript.",
    type: "PROMPT",
    author: "LeadFlow Official",
    installs: 3200,
    rating: 5.0,
    createdAt: new Date("2026-03-20"),
    payload: { variables: ["transcript", "deal_context"] },
  }
];

export class MarketplaceService {
  constructor(private db: FastifyInstance["db"]) {}

  public async listTemplates() {
    return mockTemplates;
  }

  public async publishTemplate(orgId: string, data: any) {
    // In a real application, we'd insert this into a MarketplaceTemplate model.
    // We'll mock the creation for now.
    
    const newTemplate = {
      id: `tpl_${Math.random().toString(36).substr(2, 9)}`,
      name: data.name,
      description: data.description,
      type: data.type,
      author: "Your Organization",
      installs: 0,
      rating: 0,
      createdAt: new Date(),
      payload: data.payload,
    };

    // We mutate the mock array in memory for demonstration within the same process lifecycle
    mockTemplates.unshift(newTemplate);

    return newTemplate;
  }

  public async importTemplate(orgId: string, templateId: string, workspaceId: string) {
    // Validate org and workspace
    const workspace = await this.db.workspace.findFirst({
      where: { id: workspaceId, organizationId: orgId }
    });

    if (!workspace) {
      throw new AppError("Workspace not found or unauthorized", 404);
    }

    const template = mockTemplates.find(t => t.id === templateId);
    if (!template) {
      throw new AppError("Template not found", 404);
    }

    // Here we would normally clone the template's payload into the respective table
    // (e.g., Campaign, Workflow, PromptRecord)
    template.installs += 1;

    return {
      success: true,
      message: `Template '${template.name}' successfully imported into workspace.`,
      importedType: template.type,
      workspaceId,
    };
  }
}
