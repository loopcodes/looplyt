export interface AnalysisResult {
  scores?: {
    ux: number;
    accessibility: number;
    seo: number;
    performance: number;
  };

  metrics?: {
    lcp: number;
    speedIndex: number;
    tbt: number;
    cls: number;
  };

  pageSpeed: number | null;

  authority: {
    rank: string | null;
    pageRank: number;
    pageRankInteger: number;
  };

  suggestions: string[];

  roadmap: {
    task: string;
    impact: "High" | "Medium" | "Low" | string;
  }[];
}