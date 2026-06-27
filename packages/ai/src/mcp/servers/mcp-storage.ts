import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

export class MCPStorageServer {
  public server: Server;

  constructor() {
    this.server = new Server(
      { name: "mcp-storage", version: "1.0.0" },
      { capabilities: { tools: {} } }
    );
    this.setupHandlers();
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "upload_file",
            description: "Upload a file to cloud storage",
            inputSchema: {
              type: "object",
              properties: {
                filename: { type: "string" },
                content: { type: "string" },
              },
              required: ["filename", "content"],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      if (request.params.name === "upload_file") {
        return {
          content: [
            { type: "text", text: `Mock file uploaded.` }
          ]
        };
      }
      throw new Error("Tool not found");
    });
  }
}
