import { ChatOpenAI } from "@langchain/openai";
import { AIProvider } from "./provider.interface";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";

export class OpenAIProvider implements AIProvider {
  public getModel(modelName: string, temperature: number = 0.2): BaseChatModel {
    return new ChatOpenAI({
      modelName,
      temperature,
    });
  }
}
