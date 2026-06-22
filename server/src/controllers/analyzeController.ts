import { scrapeWebsite, type SiteData } from "../services/scraper";
import { captureScreenshots } from "../services/screenshot";
import { runLighthouse } from "../services/lighthouse";
import { getOpenPageRank } from "../services/openPageRank";
import { generateAIAnalysis } from "../services/gemini";
import { calculatePageSpeed } from "../services/pageSpeed";
import { analysisCache } from "../cache";

export async function analyzeController(url: string) {
  const cached = analysisCache.get(url);

  if (cached) {
    return cached;
  }

  try {
    const domain = new URL(url).hostname;

    // Phase 1: fast parallel work
    const [siteData, screenshots, authority] = await Promise.all([
      scrapeWebsite(url),
      captureScreenshots(url),
      getOpenPageRank(domain),
    ]);

    // Phase 2: Lighthouse (heavy + queued)
    const lighthouseResult = await runLighthouse(url);
    const pageSpeed = calculatePageSpeed(lighthouseResult.metrics);

    const scores = lighthouseResult.scores;
    const metrics = lighthouseResult.metrics;

    // Safe Gemini fallback
    let aiAnalysis: {
      suggestions: string[];
      roadmap: {
        task: string;
        impact: "High" | "Medium" | "Low";
      }[];
    } = {
      suggestions: ["AI suggestions are temporarily unavailable."],
      roadmap: [],
    };

    try {
      aiAnalysis = await generateAIAnalysis({
        siteData: siteData as SiteData,
        scores,
        authority,
        url,
      });
    } catch (aiError) {
      console.error("Gemini failed:", aiError);
    }

    const result = {
      analysis: {
        scores,
        authority,
        metrics,
        pageSpeed,
        suggestions: aiAnalysis.suggestions,
        roadmap: aiAnalysis.roadmap,
      },
      screenshots,
    };

    analysisCache.set(url, result);

    return result;
  } catch (err) {
    console.error("Analysis failed:", err);
    throw err;
  }
}
