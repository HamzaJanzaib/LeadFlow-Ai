import { StateGraph, START, END } from "@langchain/langgraph";
import { AgentState, agentStateChannels } from "../agents/state";
import { supervisorAgent } from "../agents/supervisor/supervisor.agent";
import { plannerAgent } from "../agents/planner/planner.agent";
import { leadDiscoveryAgent } from "../agents/lead-discovery/lead-discovery.agent";
import { companyResearchAgent } from "../agents/company-research/company-research.agent";
import { contactDiscoveryAgent } from "../agents/contact-discovery/contact-discovery.agent";
import { websiteAuditAgent } from "../agents/website-audit/website-audit.agent";

/**
 * Builds the Lead Discovery workflow graph.
 * 
 * Flow:
 * START -> planner -> supervisor
 * supervisor routes to one of: lead_discovery, company_research, contact_discovery, website_audit, or END
 * after an execution agent runs, it routes back to supervisor.
 */
export function createLeadDiscoveryGraph() {
  const workflow = new StateGraph<AgentState>({
    channels: agentStateChannels as any,
  });

  // Add nodes
  workflow.addNode("supervisor", supervisorAgent as any);
  workflow.addNode("planner", plannerAgent as any);
  workflow.addNode("lead_discovery", leadDiscoveryAgent as any);
  workflow.addNode("company_research", companyResearchAgent as any);
  workflow.addNode("contact_discovery", contactDiscoveryAgent as any);
  workflow.addNode("website_audit", websiteAuditAgent as any);

  // Add edges
  // Start with planner to break down the goal
  (workflow as any).addEdge(START, "planner");
  (workflow as any).addEdge("planner", "supervisor");

  // Supervisor determines next step
  (workflow as any).addConditionalEdges("supervisor", (state: AgentState) => state.next, {
    lead_discovery: "lead_discovery",
    company_research: "company_research",
    contact_discovery: "contact_discovery",
    website_audit: "website_audit",
    FINISH: END,
  });

  // After an agent finishes, return to supervisor to check what's next
  (workflow as any).addEdge("lead_discovery", "supervisor");
  (workflow as any).addEdge("company_research", "supervisor");
  (workflow as any).addEdge("contact_discovery", "supervisor");
  (workflow as any).addEdge("website_audit", "supervisor");

  return workflow.compile();
}
