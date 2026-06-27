import { DocumentChunk } from "../memory/semantic.memory";
import { Embedder } from "./embedder";

export class Indexer {
  private embedder: Embedder;

  constructor() {
    this.embedder = new Embedder();
  }

  /**
   * Takes raw text, chunks it, generates embeddings, and stores it in the vector DB.
   * This is a scaffold. The actual DB insertion will use Prisma/pgvector.
   */
  public async indexDocument(sourceId: string, text: string, metadata: Record<string, any> = {}): Promise<void> {
    // Basic chunking logic (512 tokens approx. ~ 2000 chars)
    const chunks = this.chunkText(text, 2000, 200);
    
    // Embed chunks
    const embeddings = await this.embedder.embedDocuments(chunks);
    
    // Store in DB (mocked for now)
    console.log(`[Indexer] Indexed ${chunks.length} chunks for document ${sourceId}`);
    
    // Example:
    // await prisma.knowledgeChunk.createMany({ data: chunks.map((c, i) => ({ content: c, embedding: embeddings[i] })) })
  }

  private chunkText(text: string, chunkSize: number, overlap: number): string[] {
    const chunks: string[] = [];
    let i = 0;
    while (i < text.length) {
      chunks.push(text.slice(i, i + chunkSize));
      i += chunkSize - overlap;
    }
    return chunks;
  }
}
