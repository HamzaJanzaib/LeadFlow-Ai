import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { ProviderFactory } from "./providers/provider.factory";

export interface ModelConfig {
  provider?: string;
  model?: string;
  temperature?: number;
}

export class ModelGateway {
  private factory: ProviderFactory;

  constructor() {
    this.factory = new ProviderFactory();
  }

  /**
   * Get a model instance based on the provided configuration.
   */
  public getModel(config?: ModelConfig): BaseChatModel {
    // Default to OpenAI gpt-4o-mini if not specified
    const providerName = config?.provider || "openai";
    const modelName = config?.model || "gpt-4o-mini";
    const temperature = config?.temperature ?? 0.2;

    const provider = this.factory.getProvider(providerName);
    return provider.getModel(modelName, temperature);
  }

  /**
   * Advanced routing based on task complexity.
   */
  public route(taskType: "simple" | "complex" | "reasoning"): BaseChatModel {
    switch (taskType) {
      case "simple":
        return this.getModel({ provider: "openai", model: "gpt-4o-mini", temperature: 0.1 });
      case "complex":
        return this.getModel({ provider: "openai", model: "gpt-4o", temperature: 0.2 });
      case "reasoning":
        return this.getModel({ provider: "openai", model: "o1-preview", temperature: 1.0 });
      default:
        return this.getModel();
    }
  }

  /**
   * Chain models with fallbacks.
   */
  public getModelWithFallback(primary: ModelConfig, fallback: ModelConfig): BaseChatModel {
    const primaryModel = this.getModel(primary);
    const fallbackModel = this.getModel(fallback);
    return primaryModel.withFallbacks([fallbackModel]) as unknown as BaseChatModel;
  }
}
