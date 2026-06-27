import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage, AIMessage } from "@langchain/core/messages";
import { AgentState } from "../state";
import { globalPromptRegistry } from "../../prompts/registry";
import { searchGoogleTool } from "../../tools/search/searchGoogle.tool";
import { fetchWebsiteTool } from "../../tools/web/fetchWebsite.tool";

export const leadDiscoveryAgent = async (state: AgentState): Promise<Partial<AgentState>> => {
  const model = new ChatOpenAI({
    modelName: "gpt-4o",
    temperature: 0.5,
  }).bindTools([searchGoogleTool, fetchWebsiteTool]);

  const icp = state.context?.icp || "B2B SaaS companies in North America";
  const systemPromptStr = globalPromptRegistry.build("lead-discovery", { icp });

  const messages = [
    new SystemMessage(systemPromptStr),
    new SystemMessage(`Current step: ${state.plan[state.currentStepIndex] || state.goal}`),
    ...state.messages,
  ];

  const response = await model.invoke(messages);

  return {
    messages: [response],
  };
};
