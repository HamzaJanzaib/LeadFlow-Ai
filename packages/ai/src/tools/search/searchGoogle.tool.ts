import { z } from "zod";
import { BaseTool } from "../BaseTool";

const SearchGoogleSchema = z.object({
  query: z.string().describe("The search query to send to Google"),
  numResults: z.number().optional().describe("Number of results to return (default: 5)"),
});

export const searchGoogleTool = new BaseTool({
  name: "search_google",
  description: "Searches Google for the given query and returns top results. Use this to find information about companies, people, or general knowledge.",
  schema: SearchGoogleSchema,
  func: async ({ query, numResults = 5 }) => {
    // TODO: Implement actual SerpAPI or Google Custom Search integration
    console.log(`[Mock Search] Query: ${query}, Results: ${numResults}`);
    
    // Returning mocked data for now to allow the agent to progress in testing
    const mockResults = [
      {
        title: "Mock Result for " + query,
        link: "https://example.com/mock",
        snippet: "This is a mocked search result snippet containing relevant information about " + query,
      }
    ];

    return JSON.stringify(mockResults, null, 2);
  },
});
