import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

export class MCPEmailServer {
  public server: Server;

  constructor() {
    this.server = new Server(
      { name: "mcp-email", version: "1.0.0" },
      { capabilities: { tools: {} } }
    );
    this.setupHandlers();
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "send_email",
            description: "Send an email",
            inputSchema: {
              type: "object",
              properties: {
                to: { type: "string" },
                subject: { type: "string" },
                body: { type: "string" },
              },
              required: ["to", "subject", "body"],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      if (request.params.name === "send_email") {
        return {
          content: [
            { type: "text", text: `Email sent to recipient.` }
          ]
        };
      }
      throw new Error("Tool not found");
    });
  }
}
