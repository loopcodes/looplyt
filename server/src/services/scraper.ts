import axios from "axios";
import * as cheerio from "cheerio";

export interface SiteData {
  title: string;
  description: string;
  headings: string[];
}

export async function scrapeWebsite(url: string): Promise<SiteData> {
  const response = await axios.get(url, {
  timeout: 10000, // 10s max
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
  },
});
  const $ = cheerio.load(response.data);

  // Always return strings to avoid null issues
  const title = $("title").text() || "";
  const description = $('meta[name="description"]').attr("content") || "";
  const headings = $("h1, h2, h3").map((_, el) => $(el).text()).get();

  return { title, description, headings };
}