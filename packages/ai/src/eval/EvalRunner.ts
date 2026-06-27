import { EvalJudge } from "./EvalJudge";
import * as fs from "fs";
import * as path from "path";

interface EvalCase {
  id: string;
  agent: string;
  input: { goal: string };
  expectedOutput: { criteria: string[] };
}

export class EvalRunner {
  private judge: EvalJudge;
  private datasetPath: string;

  constructor(datasetPath: string) {
    this.judge = new EvalJudge();
    this.datasetPath = datasetPath;
  }

  public async run() {
    const data = fs.readFileSync(this.datasetPath, "utf-8");
    const cases: EvalCase[] = JSON.parse(data);

    const results = [];
    let totalScore = 0;

    console.log(`Starting evaluation run for ${cases.length} cases...`);

    for (const testCase of cases) {
      console.log(`Evaluating case: ${testCase.id}`);
      
      // In a real runner, we would actually invoke the specific agent or graph here.
      // For demonstration, we mock the output.
      const mockOutput = `This is a mock response for goal: ${testCase.input.goal}`;

      const evaluation = await this.judge.evaluate(
        testCase.input.goal,
        mockOutput,
        testCase.expectedOutput.criteria
      );

      results.push({
        id: testCase.id,
        score: evaluation.score,
        reasoning: evaluation.reasoning
      });

      totalScore += evaluation.score;
    }

    const avgScore = totalScore / cases.length;
    console.log(`\nEvaluation complete. Average Score: ${avgScore.toFixed(2)}/100`);
    
    return {
      averageScore: avgScore,
      results
    };
  }
}
