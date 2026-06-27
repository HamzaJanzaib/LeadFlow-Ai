import { FastifyInstance } from "fastify";
import { AppError } from "../../shared/errors/AppError";
import { WorkflowStatus } from "@leadflow/db";

export class WorkflowsService {
  constructor(private db: FastifyInstance["db"]) {}

  public async getWorkflows(orgId: string) {
    return this.db.workflow.findMany({
      where: { organizationId: orgId },
      orderBy: { createdAt: "desc" },
    });
  }

  public async getWorkflowById(orgId: string, id: string) {
    const workflow = await this.db.workflow.findFirst({
      where: { id, organizationId: orgId },
      include: { runs: { take: 10, orderBy: { startedAt: "desc" } } },
    });
    
    if (!workflow) throw new AppError("Workflow not found", 404);
    
    return workflow;
  }

  public async createWorkflow(orgId: string, workspaceId: string, data: any) {
    return this.db.workflow.create({
      data: {
        organizationId: orgId,
        workspaceId,
        name: data.name,
        description: data.description,
        triggerType: data.triggerType,
        triggerConfig: data.triggerConfig ?? {},
        nodes: data.nodes ?? [],
        edges: data.edges ?? [],
        status: WorkflowStatus.DRAFT,
      },
    });
  }

  public async updateWorkflow(orgId: string, id: string, data: any) {
    await this.getWorkflowById(orgId, id); // check existence
    return this.db.workflow.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        triggerType: data.triggerType,
        triggerConfig: data.triggerConfig,
        nodes: data.nodes,
        edges: data.edges,
      },
    });
  }

  public async setWorkflowStatus(orgId: string, id: string, status: WorkflowStatus) {
    await this.getWorkflowById(orgId, id); // check existence
    return this.db.workflow.update({
      where: { id },
      data: { status },
    });
  }

  public async processTrigger(orgId: string, triggerType: string, payload: any) {
    // Find active workflows matching the trigger
    const workflows = await this.db.workflow.findMany({
      where: { organizationId: orgId, triggerType, status: WorkflowStatus.ACTIVE },
    });

    for (const workflow of workflows) {
      // 1. Create a WorkflowRun
      const run = await this.db.workflowRun.create({
        data: {
          workflowId: workflow.id,
          triggeredBy: triggerType,
          triggerPayload: payload,
          status: "RUNNING",
          logs: [{ message: `Triggered by ${triggerType}`, time: new Date() }],
        }
      });

      try {
        const logs = [...(run.logs as any[])];

        // 2. Evaluate Nodes (Mock implementation for MVP)
        // If workflow nodes contain a "createTask" action, we do it.
        const nodes = workflow.nodes as any[];
        const hasTaskNode = nodes?.some(n => n.type === "action" && n.data?.actionType === "createTask");

        if (hasTaskNode) {
          logs.push({ message: `Executing node: createTask`, time: new Date() });
          
          await this.db.task.create({
            data: {
              organizationId: orgId,
              title: `Workflow Task: Follow up on ${triggerType}`,
              status: "TODO",
              priority: "MEDIUM",
              dueDate: new Date(Date.now() + 86400000), // tomorrow
            }
          });

          logs.push({ message: `Created CRM task successfully`, time: new Date() });
        }

        // 3. Mark Run Completed
        await this.db.workflowRun.update({
          where: { id: run.id },
          data: { 
            status: "COMPLETED", 
            completedAt: new Date(),
            logs 
          },
        });

      } catch (error: any) {
        // Mark Run Failed
        await this.db.workflowRun.update({
          where: { id: run.id },
          data: { 
            status: "FAILED", 
            error: error.message,
            completedAt: new Date(),
          },
        });
      }
    }
  }
}
