import { scrapeWebsite, type SiteData } from "../services/scraper";
import { captureScreenshots } from "../services/screenshot";
import { runLighthouse } from "../services/lighthouse";
import { getOpenPageRank } from "../services/openPageRank";
import { generateAIAnalysis } from "../services/gemini";
import { calculatePageSpeed } from "../services/pageSpeed";
import { analysisCache } from "../cache";
import type { CacheValue } from "../../../shared/types/cache";

export async function analyzeController(url: string) {
  const cached = analysisCache.get(url) as CacheValue | undefined;

  if (cached) {
    return cached;
  }

  try {
    const domain = new URL(url).hostname;

    const [siteData, screenshots, authority] = await Promise.all([
      scrapeWebsite(url),
      captureScreenshots(url),
      getOpenPageRank(domain),
    ]);

    const initialResult: CacheValue = {
      analysis: {
        scores: undefined,
        metrics: undefined,
        pageSpeed: null,
        authority,
        suggestions: ["Analyzing performance..."],
        roadmap: [],
      },
      screenshots,
    };

    analysisCache.set(url, initialResult);

    runLighthouse(url)
      .then((lighthouseResult) => {
        const pageSpeed = calculatePageSpeed(lighthouseResult.metrics);

        const cached = analysisCache.get(url) as CacheValue | undefined;
        if (!cached) return;

        analysisCache.set(url, {
          ...cached,
          analysis: {
            ...cached.analysis,
            scores: lighthouseResult.scores,
            metrics: lighthouseResult.metrics,
            pageSpeed,
          },
        });
      })
      .catch(console.error);

    generateAIAnalysis({
      siteData: siteData as SiteData,
      scores: null,
      authority,
      url,
    })
      .then((aiAnalysis) => {
        const cached = analysisCache.get(url) as CacheValue | undefined;
        if (!cached) return;

        analysisCache.set(url, {
          ...cached,
          analysis: {
            ...cached.analysis,
            suggestions: aiAnalysis.suggestions,
            roadmap: aiAnalysis.roadmap,
          },
        });
      })
      .catch(console.error);

    return initialResult;
  } catch (err) {
    console.error("Analysis failed:", err);
    throw err;
  }
}