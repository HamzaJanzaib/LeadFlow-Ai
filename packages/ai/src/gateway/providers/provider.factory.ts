import { AIProvider } from "./provider.interface";
import { OpenAIProvider } from "./openai.provider";
import { AnthropicProvider } from "./anthropic.provider";

export class ProviderFactory {
  private providers: Map<string, AIProvider>;

  constructor() {
    this.providers = new Map();
    this.providers.set("openai", new OpenAIProvider());
    this.providers.set("anthropic", new AnthropicProvider());
    // Gemini, etc. can be added here
  }

  public getProvider(name: string): AIProvider {
    const provider = this.providers.get(name.toLowerCase());
    if (!provider) {
      throw new Error(`AI Provider '${name}' is not registered or supported.`);
    }
    return provider;
  }
}
