export interface PromptDefinition {
  id: string;
  version: string;
  content: string;
  inputVariables: string[];
}

export class PromptRegistry {
  private prompts: Map<string, PromptDefinition>;

  constructor() {
    this.prompts = new Map();
  }

  /**
   * Register a new prompt template version
   */
  public register(prompt: PromptDefinition): void {
    const key = `${prompt.id}@${prompt.version}`;
    this.prompts.set(key, prompt);
  }

  /**
   * Get a specific prompt version. Defaults to v1 if no version specified.
   */
  public get(id: string, version: string = "v1"): PromptDefinition {
    const key = `${id}@${version}`;
    const prompt = this.prompts.get(key);
    if (!prompt) {
      throw new Error(`Prompt ${id} version ${version} not found in registry.`);
    }
    return prompt;
  }

  /**
   * Build the prompt string with variables injected
   */
  public build(id: string, variables: Record<string, any>, version: string = "v1"): string {
    const prompt = this.get(id, version);
    let result = prompt.content;
    
    for (const variable of prompt.inputVariables) {
      const value = variables[variable];
      if (value === undefined) {
        throw new Error(`Missing required variable: ${variable} for prompt ${id}@${version}`);
      }
      // Simple string replacement for variables in the form {{variable}}
      result = result.replace(new RegExp(`{{${variable}}}`, 'g'), String(value));
    }
    
    return result;
  }
}

// Global singleton instance for easy access
export const globalPromptRegistry = new PromptRegistry();
