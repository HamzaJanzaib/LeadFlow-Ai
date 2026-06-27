import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

export class MCPCrmServer {
  public server: Server;

  constructor() {
    this.server = new Server(
      { name: "mcp-crm", version: "1.0.0" },
      { capabilities: { tools: {} } }
    );
    this.setupHandlers();
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "create_lead",
            description: "Creates a new lead in the CRM",
            inputSchema: {
              type: "object",
              properties: {
                companyName: { type: "string" },
                domain: { type: "string" },
              },
              required: ["companyName", "domain"],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      if (request.params.name === "create_lead") {
        // Mock CRM Lead Creation
        const args = request.params.arguments as any;
        return {
          content: [
            { type: "text", text: `Successfully created lead: ${args.companyName}` }
          ]
        };
      }
      throw new Error("Tool not found");
    });
  }
}
