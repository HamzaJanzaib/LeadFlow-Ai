import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";

export class MCPClient {
  private client: Client;
  private transport: InMemoryTransport;

  constructor(serverInfo: { name: string; version: string }) {
    this.client = new Client(
      { name: serverInfo.name, version: serverInfo.version },
      { capabilities: {} }
    );
    this.transport = new InMemoryTransport();
  }

  public async connect(): Promise<void> {
    await this.client.connect(this.transport);
    console.log(`[MCP Client] Connected to transport`);
  }

  public async listTools() {
    return this.client.listTools();
  }

  public async callTool(name: string, args: Record<string, any>) {
    return this.client.callTool({ name, arguments: args });
  }
}
