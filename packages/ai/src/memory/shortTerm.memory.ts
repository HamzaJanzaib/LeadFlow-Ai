import { BaseMessage } from "@langchain/core/messages";

export interface SessionMemory {
  sessionId: string;
  messages: BaseMessage[];
  expiresAt: Date;
}

export class ShortTermMemory {
  // A simple in-memory cache for now. Will be backed by ioredis in production.
  private store: Map<string, SessionMemory>;

  constructor() {
    this.store = new Map();
  }

  public async getMessages(sessionId: string): Promise<BaseMessage[]> {
    const session = this.store.get(sessionId);
    if (!session || session.expiresAt < new Date()) {
      return [];
    }
    return session.messages;
  }

  public async addMessage(sessionId: string, message: BaseMessage): Promise<void> {
    const session = this.store.get(sessionId);
    if (session) {
      session.messages.push(message);
      session.expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour TTL
    } else {
      this.store.set(sessionId, {
        sessionId,
        messages: [message],
        expiresAt: new Date(Date.now() + 1000 * 60 * 60),
      });
    }
  }

  public async clear(sessionId: string): Promise<void> {
    this.store.delete(sessionId);
  }
}
