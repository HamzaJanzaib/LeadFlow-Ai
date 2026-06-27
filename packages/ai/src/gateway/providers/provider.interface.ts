import { BaseChatModel } from "@langchain/core/language_models/chat_models";

export interface AIProvider {
  getModel(modelName: string, temperature?: number): BaseChatModel;
}
