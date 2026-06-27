import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

export interface ToolConfig<T extends z.ZodObject<any, any, any, any>> {
  name: string;
  description: string;
  schema: T;
  func: (input: z.infer<T>, runManager?: any, config?: any) => Promise<string>;
  maxRetries?: number;
}

export class BaseTool<T extends z.ZodObject<any, any, any, any>> extends DynamicStructuredTool<T> {
  constructor(config: ToolConfig<T>) {
    super({
      name: config.name,
      description: config.description,
      schema: config.schema,
      func: async (input, runManager, runConfig) => {
        let attempts = 0;
        const maxRetries = config.maxRetries ?? 3;
        while (attempts < maxRetries) {
          try {
            return await config.func(input, runManager, runConfig);
          } catch (error: any) {
            attempts++;
            if (attempts >= maxRetries) {
              return `Error: Failed after ${maxRetries} attempts. Details: ${error.message}`;
            }
            // Exponential backoff
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 1000));
          }
        }
        return "Error: Unknown failure.";
      },
    });
  }
}
