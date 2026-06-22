import type { AnalysisResult } from "./analysis";
import type { Screenshot } from "./screenshot";

export interface CacheValue {
  analysis: AnalysisResult;
  screenshots: Screenshot[];
}