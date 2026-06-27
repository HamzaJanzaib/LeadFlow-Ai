import { FastifyInstance } from "fastify";
import { AppError } from "../../shared/errors/AppError";

export class ProposalsService {
  constructor(private db: FastifyInstance["db"]) {}

  async generateFromDeal(orgId: string, dealId: string, title: string) {
    const deal = await this.db.deal.findFirst({
      where: { id: dealId, organizationId: orgId },
      include: { lead: true }
    });

    if (!deal) {
      throw new AppError("Deal not found", 404);
    }

    // AI mocking for now: in reality, we'd pass deal context to ai.service.ts
    const mockExecutiveSummary = `<p>Thank you for considering LeadFlow AI for your upcoming project.</p><p>Based on our discussions, we understand that <strong>${deal.lead?.company || 'your company'}</strong> is looking to automate lead generation and streamline the sales pipeline. Our proposed solution is designed specifically to address these challenges.</p>`;
    
    const mockScopeOfWork = `<h3>Phase 1: Discovery & Strategy</h3><p>We will conduct a comprehensive audit of your current processes.</p><h3>Phase 2: Implementation</h3><p>Deployment of the AI agents and integration with your existing CRM.</p><h3>Phase 3: Training</h3><p>Onboarding your team to maximize the platform's utility.</p>`;

    const mockTerms = `<p>This proposal is valid for 30 days from the date of issue. Payment terms are Net 30.</p>`;

    const proposal = await this.db.proposal.create({
      data: {
        organizationId: orgId,
        dealId,
        title,
        status: "draft",
        executiveSummary: mockExecutiveSummary,
        scopeOfWork: mockScopeOfWork,
        terms: mockTerms,
        totalValue: deal.value || 0,
        currency: deal.currency || "USD",
      },
    });

    return proposal;
  }

  async getProposals(orgId: string, dealId?: string) {
    return this.db.proposal.findMany({
      where: {
        organizationId: orgId,
        ...(dealId ? { dealId } : {})
      },
      orderBy: { createdAt: "desc" },
      include: { deal: true }
    });
  }

  async getProposalById(orgId: string, id: string) {
    const proposal = await this.db.proposal.findFirst({
      where: { id, organizationId: orgId },
      include: { deal: { include: { lead: true } } }
    });

    if (!proposal) {
      throw new AppError("Proposal not found", 404);
    }

    return proposal;
  }

  async updateProposal(orgId: string, id: string, data: any) {
    const proposal = await this.db.proposal.findFirst({
      where: { id, organizationId: orgId }
    });

    if (!proposal) {
      throw new AppError("Proposal not found", 404);
    }

    return this.db.proposal.update({
      where: { id },
      data,
    });
  }
}
