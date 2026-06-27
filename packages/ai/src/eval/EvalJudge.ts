import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { z } from "zod";

const scoreSchema = z.object({
  score: z.number().min(0).max(100).describe("A score from 0 to 100 on how well the output meets the criteria."),
  reasoning: z.string().describe("Explanation for why this score was given."),
});

export class EvalJudge {
  private model: ReturnType<typeof ChatOpenAI.prototype.bindTools>;

  constructor() {
    this.model = new ChatOpenAI({
      modelName: "gpt-4o",
      temperature: 0,
    }).withStructuredOutput(scoreSchema, { name: "evaluation" }) as any;
  }

  public async evaluate(input: string, output: string, expectedCriteria: string[]): Promise<{ score: number, reasoning: string }> {
    const prompt = `You are an expert evaluator. Score the provided output based on the input goal and the criteria.
    
    Input Goal: ${input}
    
    Expected Criteria:
    ${expectedCriteria.map(c => `- ${c}`).join("\n")}
    
    Output to Evaluate:
    ${output}
    `;

    const result = await this.model.invoke([
      new SystemMessage("You are an impartial judge evaluating AI outputs."),
      new HumanMessage(prompt)
    ]) as any;

    return {
      score: result.score,
      reasoning: result.reasoning
    };
  }
}
