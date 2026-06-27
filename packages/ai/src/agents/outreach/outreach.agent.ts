import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage } from "@langchain/core/messages";
import { AgentState } from "../state";

export const outreachAgent = async (state: AgentState): Promise<Partial<AgentState>> => {
  const model = new ChatOpenAI({
    modelName: "gpt-4o",
    temperature: 0.7, // Higher temp for creative writing
  });

  const messages = [
    new SystemMessage(`You are the Outreach Agent. Your job is to write highly personalized, compelling email sequences based on research data and website audits.`),
    new SystemMessage(`Current step: ${state.plan[state.currentStepIndex] || state.goal}`),
    ...state.messages,
  ];

  const response = await model.invoke(messages);

  return {
    messages: [response],
  };
};
