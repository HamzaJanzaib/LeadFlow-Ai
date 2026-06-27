import { FastifyPluginAsync } from "fastify";
import { ProposalsService } from "./proposals.service";
import { AppError } from "../../shared/errors/AppError";
import { generateProposalSchema, updateProposalSchema } from "./proposals.schema";

export const proposalsRoutes: FastifyPluginAsync = async (app) => {
  const proposalsService = new ProposalsService(app.db);

  app.addHook("preHandler", async (request) => {
    if (!request.user) {
      throw new AppError("Unauthorized", 401);
    }
  });

  // GET /proposals
  app.get<{ Querystring: { dealId?: string } }>("/", async (request, reply) => {
    const orgId = request.headers["x-organization-id"] as string;
    if (!orgId) throw new AppError("x-organization-id header required", 400);

    const { dealId } = request.query;
    const proposals = await proposalsService.getProposals(orgId, dealId);
    return reply.send(proposals);
  });

  // GET /proposals/:id
  app.get<{ Params: { id: string } }>("/:id", async (request, reply) => {
    const orgId = request.headers["x-organization-id"] as string;
    if (!orgId) throw new AppError("x-organization-id header required", 400);
    const { id } = request.params;
    
    const proposal = await proposalsService.getProposalById(orgId, id);
    return reply.send(proposal);
  });

  // POST /proposals
  app.post<{ Body: any }>("/", async (request, reply) => {
    const orgId = request.headers["x-organization-id"] as string;
    if (!orgId) throw new AppError("x-organization-id header required", 400);

    const data = generateProposalSchema.parse(request.body);
    const proposal = await proposalsService.generateFromDeal(orgId, data.dealId, data.title);
    return reply.status(201).send(proposal);
  });

  // PUT /proposals/:id
  app.put<{ Params: { id: string }, Body: any }>("/:id", async (request, reply) => {
    const orgId = request.headers["x-organization-id"] as string;
    if (!orgId) throw new AppError("x-organization-id header required", 400);
    const { id } = request.params;
    
    const data = updateProposalSchema.parse(request.body);
    const proposal = await proposalsService.updateProposal(orgId, id, data);
    return reply.send(proposal);
  });

  // POST /proposals/:id/export-pdf
  app.post<{ Params: { id: string } }>("/:id/export-pdf", async (request, reply) => {
    const orgId = request.headers["x-organization-id"] as string;
    if (!orgId) throw new AppError("x-organization-id header required", 400);
    const { id } = request.params;
    
    // In a real scenario, this would use a PDF generation service (like Puppeteer) 
    // to render the proposal and upload to S3/MinIO.
    // For now, we mock the PDF URL return.
    return reply.send({ pdfUrl: `https://storage.leadflow.ai/proposals/${id}.pdf` });
  });
};
