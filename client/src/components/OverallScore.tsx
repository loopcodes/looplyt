import { useEffect, useState } from "react";
import type { AnalysisResult } from "@shared/types/analysis";

interface Props {
  scores: AnalysisResult["scores"];
  authority: AnalysisResult["authority"];
}

export default function OverallScore({ scores, authority }: Props) {
  const authorityScore = Math.min((authority.pageRank ?? 0) * 10, 100);

  const overall =
    scores
      ? (
          (scores.ux ?? 0) * 0.25 +
          (scores.accessibility ?? 0) * 0.2 +
          (scores.seo ?? 0) * 0.25 +
          (scores.performance ?? 0) * 0.25 +
          authorityScore * 0.05
        )
      : 0;

  const percent = Math.round(overall);

  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 800;
    const startTime = performance.now();

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayValue(Math.floor(eased * percent));

      if (t < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [percent]);

  const radius = 70;
  const stroke = 10;
  const circumference = 2 * Math.PI * radius;
  const progress = (displayValue / 100) * circumference;

  const getLabel = (value: number) => {
    if (value >= 90) return "You're doing almost everything right";
    if (value >= 80) return "Just a few minor improvements left";
    if (value >= 70) return "There's clear room to level up";
    if (value >= 60) return "Users will notice some friction";
    if (value >= 50) return "Important issues need attention";
    return "This needs serious improvement";
  };

  const label = getLabel(displayValue);

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-3">
      <h2 className="text-xl font-semibold text-gray-700">
        Overall Score
      </h2>

      <div className="relative w-40 h-40">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={stroke}
            fill="transparent"
          />

          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="#4f46e5"
            strokeWidth={stroke}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-5xl font-extrabold text-indigo-700 tabular-nums">
            {displayValue}
          </div>
          <div className="text-xs text-gray-500">/ 100</div>
        </div>
      </div>

      <div className="text-sm font-medium text-gray-600">
        {scores ? label : "Analyzing performance..."}
      </div>
    </div>
  );
}