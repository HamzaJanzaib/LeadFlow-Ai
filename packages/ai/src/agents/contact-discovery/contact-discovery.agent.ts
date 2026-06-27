import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage } from "@langchain/core/messages";
import { AgentState } from "../state";
import { searchGoogleTool } from "../../tools/search/searchGoogle.tool";

export const contactDiscoveryAgent = async (state: AgentState): Promise<Partial<AgentState>> => {
  const model = new ChatOpenAI({
    modelName: "gpt-4o",
    temperature: 0.3,
  }).bindTools([searchGoogleTool]);

  const messages = [
    new SystemMessage(`You are the Contact Discovery Agent. Your job is to find key decision-makers and their contact info for a given target company.`),
    new SystemMessage(`Current step: ${state.plan[state.currentStepIndex] || state.goal}`),
    ...state.messages,
  ];

  const response = await model.invoke(messages);

  return {
    messages: [response],
  };
};
