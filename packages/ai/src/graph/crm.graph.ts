import { StateGraph, START, END } from "@langchain/langgraph";
import { AgentState, agentStateChannels } from "../agents/state";
import { supervisorAgent } from "../agents/supervisor/supervisor.agent";
import { knowledgeAgent } from "../agents/knowledge/knowledge.agent";
import { crmAgent } from "../agents/crm/crm.agent";

/**
 * Builds the CRM workflow graph.
 * 
 * Flow:
 * START -> supervisor
 * supervisor routes to: knowledge, crm, or END
 */
export function createCrmGraph() {
  const workflow = new StateGraph<AgentState>({
    channels: agentStateChannels as any,
  });

  // Add nodes
  workflow.addNode("supervisor", supervisorAgent as any);
  workflow.addNode("knowledge", knowledgeAgent as any);
  workflow.addNode("crm", crmAgent as any);

  // Add edges
  (workflow as any).addEdge(START, "supervisor");

  (workflow as any).addConditionalEdges("supervisor", (state: AgentState) => state.next, {
    knowledge: "knowledge",
    crm: "crm",
    FINISH: END,
  });

  (workflow as any).addEdge("knowledge", "supervisor");
  (workflow as any).addEdge("crm", "supervisor");

  return workflow.compile();
}
