import NodeCache from "node-cache";
import type { AnalysisResult } from "@shared/types/analysis";
import type { CacheValue } from "@shared/types/cache";

/**
 * In-memory cache for website analysis results.
 * TTL: 24 hours
 */
export const analysisCache = new NodeCache({
  stdTTL: 60 * 60 * 24,
  checkperiod: 60 * 10,
  useClones: false,
});

/**
 * Get cached analysis
 */
export function getAnalysisCache(url: string): CacheValue | undefined {
  return analysisCache.get(url) as CacheValue | undefined;
}

/**
 * Set cached analysis
 */
export function setAnalysisCache(url: string, data: CacheValue) {
  analysisCache.set(url, data);
}