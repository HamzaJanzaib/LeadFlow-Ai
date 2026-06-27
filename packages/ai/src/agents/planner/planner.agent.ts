import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage, AIMessage } from "@langchain/core/messages";
import { z } from "zod";
import { AgentState } from "../state";

const planSchema = z.object({
  steps: z.array(z.string()).describe("A list of clear, actionable steps to fulfill the user's request."),
});

export const plannerAgent = async (state: AgentState): Promise<Partial<AgentState>> => {
  const model = new ChatOpenAI({
    modelName: "gpt-4o",
    temperature: 0.2,
  }).withStructuredOutput(planSchema, { name: "plan" });

  const messages = [
    new SystemMessage(`You are the Planner Agent. Your job is to break down the user's goal into a step-by-step execution plan for other specialized agents to follow.`),
    new SystemMessage(`Goal: ${state.goal}`),
  ];

  const response = await model.invoke(messages);

  return {
    plan: response.steps,
    currentStepIndex: 0,
    messages: [new AIMessage(`Created plan with ${response.steps.length} steps.`)],
  };
};
