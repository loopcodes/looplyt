import ScoreCard from "./ScoreCard";
import type { AnalysisResult } from "@shared/types/analysis";

interface Props {
  scores: AnalysisResult["scores"];
  authority: AnalysisResult["authority"];
}

export default function AnalysisBreakdown({ scores, authority }: Props) {

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        Analysis Breakdown
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <ScoreCard label="UX" score={scores?.ux ?? null} />
        <ScoreCard
          label="Accessibility"
          score={scores?.accessibility ?? null}
        />
        <ScoreCard label="SEO" score={scores?.seo ?? null} />
        <ScoreCard
          label="Performance"
          score={scores?.performance ?? null}
        />
        <ScoreCard
          label="Authority"
          score={Math.round(authority.pageRank * 10)}
        />
      </div>
    </div>
  );
}