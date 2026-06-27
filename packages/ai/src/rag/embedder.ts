import { OpenAIEmbeddings } from "@langchain/openai";

export interface EmbedderConfig {
  provider?: "openai" | "local";
  modelName?: string;
}

export class Embedder {
  private embeddings: OpenAIEmbeddings; // Default to OpenAI for now

  constructor(config?: EmbedderConfig) {
    const modelName = config?.modelName || "text-embedding-3-small";
    
    // In the future, this can switch to local embeddings (e.g., using @langchain/community/embeddings/hf)
    this.embeddings = new OpenAIEmbeddings({
      modelName,
      // API key is picked up from OPENAI_API_KEY env var
    });
  }

  /**
   * Generate embedding for a single text string.
   */
  public async embedQuery(text: string): Promise<number[]> {
    return this.embeddings.embedQuery(text);
  }

  /**
   * Generate embeddings for an array of document chunks.
   */
  public async embedDocuments(texts: string[]): Promise<number[][]> {
    return this.embeddings.embedDocuments(texts);
  }
}
