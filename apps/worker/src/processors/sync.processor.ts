import { Indexer } from "@leadflow/ai/src/rag/indexer";

export interface SyncJobData {
  sourceId: string;
  sourceType: "crm_note" | "email" | "uploaded_file" | "meeting_note";
  content: string;
  metadata?: Record<string, any>;
}

export class SyncProcessor {
  private indexer: Indexer;

  constructor() {
    this.indexer = new Indexer();
  }

  /**
   * Processes an individual sync job.
   */
  public async processJob(job: { id: string; data: SyncJobData }): Promise<void> {
    const { sourceId, sourceType, content, metadata } = job.data;
    console.log(`[SyncProcessor] Processing job ${job.id} for ${sourceType} ${sourceId}`);

    try {
      // 1. Detect changes (mocked)
      // 2. Extract Document (already passed as content for now)
      
      // 3. Chunk & Embed via Indexer
      await this.indexer.indexDocument(sourceId, content, {
        sourceType,
        ...metadata,
      });

      // 4. Update sync record in DB (mocked)
      console.log(`[SyncProcessor] Successfully processed ${sourceId}`);
    } catch (error: any) {
      console.error(`[SyncProcessor] Failed to process ${sourceId}:`, error);
      throw error;
    }
  }
}
