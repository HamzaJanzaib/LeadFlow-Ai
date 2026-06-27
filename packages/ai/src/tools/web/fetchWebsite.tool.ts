import { z } from "zod";
import { BaseTool } from "../BaseTool";

const FetchWebsiteSchema = z.object({
  url: z.string().url().describe("The full URL of the website to fetch"),
});

export const fetchWebsiteTool = new BaseTool({
  name: "fetch_website",
  description: "Fetches the text content of a website. Use this to read company about pages, blogs, or news articles.",
  schema: FetchWebsiteSchema,
  func: async ({ url }) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const html = await response.text();
      // Extremely basic HTML to text for MVP. Later replace with Playwright + Cheerio or similar
      const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      return text.substring(0, 4000); // Truncate to save tokens
    } catch (e: any) {
      throw new Error(`Failed to fetch website: ${e.message}`);
    }
  },
});
