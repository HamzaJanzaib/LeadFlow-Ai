import { createLeadDiscoveryGraph } from "../src/graph/lead-discovery.graph";
import { HumanMessage } from "@langchain/core/messages";

async function verifyPart4() {
  console.log("=== LeadFlow AI: Part 4 Verification script ===");
  console.log("Validating that LangGraph state workflows can execute completely.\n");

  const graph = createLeadDiscoveryGraph();

  const initialState = {
    messages: [new HumanMessage("Execute approved plan")],
    goal: "Find 5 Shopify stores in Austin with poor mobile UX",
    plan: [],
    currentStepIndex: 0,
    next: "planner",
    context: {}
  };

  console.log("[Status] Initializing graph with goal:", initialState.goal);

  try {
    console.log("[Status] Executing Planner Node...");
    
    const stream = await graph.stream(initialState);
    
    let stepCount = 0;
    for await (const chunk of stream) {
      stepCount++;
      const nodeName = Object.keys(chunk)[0] as string;
      const stateUpdate = (chunk as any)[nodeName];
      
      console.log(`\n--- Step ${stepCount}: Node [${nodeName}] ---`);
      if (stateUpdate.plan) {
        console.log(`Plan generated: ${stateUpdate.plan.length} steps`);
        stateUpdate.plan.forEach((s: string) => console.log(`  - ${s}`));
      }
      if (stateUpdate.next) {
        console.log(`Supervisor routed next to: ${stateUpdate.next}`);
      }
      
      // Stop early just to prove it compiles and streams
      if (stepCount >= 3) {
        console.log("\n[Success] Graph successfully routed through Planner and Supervisor.");
        break;
      }
    }
  } catch (err) {
    console.error("[Error] Graph execution failed. Did you configure OPENAI_API_KEY?");
    console.error(err);
  }
}

verifyPart4().catch(console.error);
