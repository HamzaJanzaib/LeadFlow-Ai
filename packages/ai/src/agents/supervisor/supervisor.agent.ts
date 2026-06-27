import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { z } from "zod";
import { AgentState } from "../state";
import { globalPromptRegistry } from "../../prompts/registry";
import { ModelGateway } from "../../gateway/ModelGateway";

const routerSchema = z.object({
  next: z.enum([
    "FINISH",
    "planner",
    "lead_discovery",
    "company_research",
    "contact_discovery",
    "website_audit",
    "outreach",
    "crm",
    "analytics",
    "knowledge",
  ]).describe("The next agent to route the task to, or FINISH if the goal is complete."),
});

export const supervisorAgent = async (state: AgentState): Promise<Partial<AgentState>> => {
  const model = new ChatOpenAI({
    modelName: "gpt-4o",
    temperature: 0,
  }).withStructuredOutput(routerSchema, { name: "route" });

  const systemPromptStr = globalPromptRegistry.build("supervisor", {
    user_request: state.goal,
    context: JSON.stringify(state.context),
  });

  const messages = [
    new SystemMessage(systemPromptStr),
    ...state.messages,
  ];

  const response = await model.invoke(messages);

  return {
    next: response.next,
  };
};
