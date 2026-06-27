import { StateGraph, START, END } from "@langchain/langgraph";
import { AgentState, agentStateChannels } from "../agents/state";
import { supervisorAgent } from "../agents/supervisor/supervisor.agent";
import { knowledgeAgent } from "../agents/knowledge/knowledge.agent";
import { outreachAgent } from "../agents/outreach/outreach.agent";

/**
 * Builds the Outreach workflow graph.
 * 
 * Flow:
 * START -> supervisor
 * supervisor routes to: knowledge, outreach, or END
 */
export function createOutreachGraph() {
  const workflow = new StateGraph<AgentState>({
    channels: agentStateChannels as any,
  });

  // Add nodes
  workflow.addNode("supervisor", supervisorAgent as any);
  workflow.addNode("knowledge", knowledgeAgent as any);
  workflow.addNode("outreach", outreachAgent as any);

  // Add edges
  (workflow as any).addEdge(START, "supervisor");

  (workflow as any).addConditionalEdges("supervisor", (state: AgentState) => state.next, {
    knowledge: "knowledge",
    outreach: "outreach",
    FINISH: END,
  });

  (workflow as any).addEdge("knowledge", "supervisor");
  (workflow as any).addEdge("outreach", "supervisor");

  return workflow.compile();
}
