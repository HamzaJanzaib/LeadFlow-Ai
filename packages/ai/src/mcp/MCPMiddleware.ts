import { MCPClient } from "./MCPClient";

/**
 * Middleware layer to handle dynamic tool binding and request routing.
 * In a real-world scenario, this acts as a gateway connecting Fastify to the local or remote MCP servers.
 */
export class MCPMiddleware {
  private client: MCPClient;

  constructor() {
    this.client = new MCPClient({ name: "leadflow-middleware", version: "1.0.0" });
  }

  public async initialize() {
    await this.client.connect();
    console.log("[MCP Middleware] Initialized and connected.");
  }

  public getClient(): MCPClient {
    return this.client;
  }
}
