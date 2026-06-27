import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage } from "@langchain/core/messages";
import { AgentState } from "../state";
import { createLeadTool } from "../../tools/crm/createLead.tool";

export const crmAgent = async (state: AgentState): Promise<Partial<AgentState>> => {
  const model = new ChatOpenAI({
    modelName: "gpt-4o",
    temperature: 0.1,
  }).bindTools([createLeadTool]);

  const messages = [
    new SystemMessage(`You are the CRM Agent. Your job is to manage the state of deals, tasks, and leads in the CRM database.`),
    new SystemMessage(`Current step: ${state.plan[state.currentStepIndex] || state.goal}`),
    ...state.messages,
  ];

  const response = await model.invoke(messages);

  return {
    messages: [response],
  };
};
