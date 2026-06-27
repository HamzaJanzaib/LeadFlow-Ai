import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage } from "@langchain/core/messages";
import { AgentState } from "../state";
import { searchGoogleTool } from "../../tools/search/searchGoogle.tool";
import { fetchWebsiteTool } from "../../tools/web/fetchWebsite.tool";

export const companyResearchAgent = async (state: AgentState): Promise<Partial<AgentState>> => {
  const model = new ChatOpenAI({
    modelName: "gpt-4o",
    temperature: 0.3,
  }).bindTools([searchGoogleTool, fetchWebsiteTool]);

  const messages = [
    new SystemMessage(`You are the Company Research Agent. Your job is to deeply research a target company and extract firmographics, tech stack, and recent news.`),
    new SystemMessage(`Current step: ${state.plan[state.currentStepIndex] || state.goal}`),
    ...state.messages,
  ];

  const response = await model.invoke(messages);

  return {
    messages: [response],
  };
};
