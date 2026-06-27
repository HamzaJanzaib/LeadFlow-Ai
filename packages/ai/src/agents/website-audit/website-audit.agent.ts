import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage } from "@langchain/core/messages";
import { AgentState } from "../state";
import { fetchWebsiteTool } from "../../tools/web/fetchWebsite.tool";

export const websiteAuditAgent = async (state: AgentState): Promise<Partial<AgentState>> => {
  const model = new ChatOpenAI({
    modelName: "gpt-4o",
    temperature: 0.2,
  }).bindTools([fetchWebsiteTool]);

  const messages = [
    new SystemMessage(`You are the Website Audit Agent. Your job is to analyze a company's website to identify pain points, UX issues, and missing value propositions.`),
    new SystemMessage(`Current step: ${state.plan[state.currentStepIndex] || state.goal}`),
    ...state.messages,
  ];

  const response = await model.invoke(messages);

  return {
    messages: [response],
  };
};
