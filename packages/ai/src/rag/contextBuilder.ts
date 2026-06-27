import { DocumentChunk } from "../memory/semantic.memory";

export class ContextBuilder {
  /**
   * Formats a list of document chunks into a single string for LLM context injection.
   */
  public static buildContextString(chunks: DocumentChunk[]): string {
    if (chunks.length === 0) {
      return "No relevant context found.";
    }

    return chunks.map((chunk, index) => {
      const source = chunk.metadata?.source || "Unknown source";
      return `[Document ${index + 1} - Source: ${source}]\n${chunk.content}`;
    }).join("\n\n---\n\n");
  }
}
