import { ChatAnthropic } from "@langchain/anthropic";
import { AIProvider } from "./provider.interface";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";

export class AnthropicProvider implements AIProvider {
  public getModel(modelName: string, temperature: number = 0.2): BaseChatModel {
    return new ChatAnthropic({
      modelName,
      temperature,
    });
  }
}
