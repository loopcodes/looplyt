import { GoogleGenAI } from "@google/genai";
import { type SiteData } from "./scraper";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

interface Scores {
  ux: number | null;
  accessibility: number | null;
  seo: number | null;
  performance: number |null;
}

interface Authority {
  rank: string | null;
  pageRank: number;
  pageRankInteger: number;
}

type AIOutput = {
  suggestions: string[];
  roadmap: {
    task: string;
    impact: "High" | "Medium" | "Low";
  }[];
};

export async function generateAIAnalysis({
  siteData,
  scores,
  authority,
  url,
}: {
  siteData: SiteData;
  scores: Scores;
  authority: Authority;
  url: string;
}): Promise<AIOutput> {
const prompt = `
You are a senior UX, SEO, and performance auditor.

Analyze this website.

Return ONLY valid JSON.

URL: ${url}

SITE DATA:
- Title: ${siteData.title ?? "N/A"}
- Description: ${siteData.description ?? "N/A"}
- Headings: ${siteData.headings.join(", ")}

SCORES:
- UX: ${scores.ux}
- Accessibility: ${scores.accessibility}
- SEO: ${scores.seo}
- Performance: ${scores.performance}

AUTHORITY:
- PageRank: ${authority.pageRank}
- Rank: ${authority.rank ?? "N/A"}

IMPORTANT:

"suggestions":
- High-level observations
- Strategic insights
- Human-readable recommendations
- NOT implementation steps

"roadmap":
- Concrete implementation tasks
- Specific actions developers/designers can take
- Short and actionable

OUTPUT FORMAT:
{
  "suggestions": string[],
  "roadmap": [
    {
      "task": string,
      "impact": "High" | "Medium" | "Low"
    }
  ]
}

RULES:
- No markdown
- No explanations
- No duplicate ideas between sections
- Return JSON only
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const text = response.text;

  // Safety check (fixes TS error + runtime safety)
  if (!text || typeof text !== "string") {
    console.error("Gemini returned empty response:", response);
    throw new Error("Gemini returned no content");
  }

  // Clean possible markdown formatting
  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    const parsed = JSON.parse(cleaned) as AIOutput;

    // basic validation guard
    if (!parsed.suggestions || !parsed.roadmap) {
      throw new Error("Invalid AI structure");
    }

    return parsed;
  } catch (err) {
    console.error("Failed to parse Gemini output:", text);

    return {
      suggestions: ["AI analysis failed. Please try again."],
      roadmap: [],
    };
  }
}