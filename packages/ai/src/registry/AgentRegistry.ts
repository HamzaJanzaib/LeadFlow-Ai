export interface AgentDefinition {
  id: string;
  name: string;
  description: string;
  version: string;
  invoke: (input: any, context?: any) => Promise<any>;
}

export interface AgentHealth {
  status: "healthy" | "degraded" | "offline";
  lastChecked: Date;
  uptimeSeconds?: number;
}

export class AgentRegistry {
  private agents: Map<string, AgentDefinition>;
  private healthCache: Map<string, AgentHealth>;

  constructor() {
    this.agents = new Map();
    this.healthCache = new Map();
  }

  public register(agent: AgentDefinition): void {
    if (this.agents.has(agent.id)) {
      throw new Error(`Agent with ID '${agent.id}' is already registered.`);
    }
    this.agents.set(agent.id, agent);
    this.healthCache.set(agent.id, {
      status: "healthy",
      lastChecked: new Date(),
      uptimeSeconds: 0,
    });
  }

  public get(agentId: string): AgentDefinition {
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new Error(`Agent with ID '${agentId}' not found.`);
    }
    return agent;
  }

  public list(): AgentDefinition[] {
    return Array.from(this.agents.values());
  }

  public async invoke(agentId: string, input: any, context?: any): Promise<any> {
    const agent = this.get(agentId);
    try {
      return await agent.invoke(input, context);
    } catch (error) {
      this.updateHealth(agentId, "degraded");
      throw error;
    }
  }

  public getHealth(agentId: string): AgentHealth {
    const health = this.healthCache.get(agentId);
    if (!health) {
      throw new Error(`Health status for agent ID '${agentId}' not found.`);
    }
    return health;
  }

  private updateHealth(agentId: string, status: AgentHealth["status"]): void {
    const health = this.healthCache.get(agentId);
    if (health) {
      health.status = status;
      health.lastChecked = new Date();
      this.healthCache.set(agentId, health);
    }
  }
}
