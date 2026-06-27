import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage } from "@langchain/core/messages";
import { AgentState } from "../state";
import { Retriever } from "../../rag/retriever";
import { ContextBuilder } from "../../rag/contextBuilder";

export const knowledgeAgent = async (state: AgentState): Promise<Partial<AgentState>> => {
  const model = new ChatOpenAI({
    modelName: "gpt-4o",
    temperature: 0.2,
  });

  // Example usage of the Retriever inside the knowledge agent
  const retriever = new Retriever();
  const currentStepInfo = state.plan[state.currentStepIndex] || state.goal;
  
  // Retrieve relevant documents
  const chunks = await retriever.retrieve(currentStepInfo);
  const ragContext = ContextBuilder.buildContextString(chunks);

  const messages = [
    new SystemMessage(`You are the Knowledge Agent. Your job is to answer questions and provide context based on the user's internal documents, CRM notes, and historical data.`),
    new SystemMessage(`Relevant Knowledge Context:\n${ragContext}`),
    new SystemMessage(`Current step: ${currentStepInfo}`),
    ...state.messages,
  ];

  const response = await model.invoke(messages);

  return {
    messages: [response],
  };
};
