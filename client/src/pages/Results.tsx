import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import {
  MdOutlineKeyboardArrowUp,
  MdOutlineKeyboardArrowDown,
} from "react-icons/md";

import AuthorityCard from "../components/AuthorityCard";
import PageSpeedCard from "../components/PageSpeedCard";
import PerformanceBreakdown from "../components/PerformanceBreakdown";
import AnalysisBreakdown from "../components/AnalysisBreakdown";
import ScreenshotPreview from "../components/ScreenshotPreview";
import SuggestionsList from "../components/SuggestionsList";
import Roadmap from "../components/Roadmap";
import Navbar from "../components/Navbar";
import OverallScore from "../components/OverallScore";
import AnalysisLoader from "../components/Loader";
import type { Screenshot } from "../types/screenshot";

interface AnalysisResult {
  scores: {
    ux: number;
    accessibility: number;
    seo: number;
    performance: number;
  };
  metrics: {
    lcp: number | null;
    speedIndex: number | null;
    tbt: number | null;
    cls: number | null;
  };
  pageSpeed: number | null;
  authority: {
    rank: string | null;
    pageRank: number;
    pageRankInteger: number;
  };
  suggestions: string[];
  roadmap: { task: string; impact: string }[];
}

const API_URL = import.meta.env.VITE_API_URL;

export default function Results() {
  const location = useLocation();
  const state = location.state as { url: string } | null;

  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [loading, setLoading] = useState(true);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [error, setError] = useState("");

  const url = state?.url;
  const PREVIEW_COUNT = 3;

  useEffect(() => {
    if (!url) return;

    const fetchAnalysis = async () => {
      try {
        const res = await fetch(`${API_URL}/api/analyze`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || "Failed to analyze website");
        }

        setResult(data.analysis);
        setScreenshots(data.screenshots);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [url]);

  if (loading) {
    return <AnalysisLoader />;
  }

  if (error) {
    return <p className="p-6 text-center text-red-500">{error}</p>;
  }

  if (!url) {
    return (
      <p className="p-6 text-center text-gray-500">No website URL provided.</p>
    );
  }

  if (!result) {
    return (
      <p className="p-6 text-center text-gray-500">
        No analysis returned from server.
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-400/10 via-purple-400/10 to-sky-400/10">
      <Navbar />

      <div className="max-w-6xl p-2 mt-4 mx-auto">
        {/* Screenshot + Overall Score */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="flex-1">
            <ScreenshotPreview screenshots={screenshots} />
          </div>

          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-lg p-6 h-full flex items-center justify-center">
              <OverallScore
                scores={result.scores}
                authority={result.authority}
              />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <AuthorityCard
              pageRank={result.authority.pageRank}
              rank={result.authority.rank}
            />
            <PageSpeedCard pageSpeed={result.pageSpeed} />
          </div>
        </div>

        {/* Score Cards */}
        <AnalysisBreakdown
          scores={result.scores}
          authority={result.authority}
        />
        <PerformanceBreakdown metrics={result.metrics} />

        {/* Suggestions + Roadmap */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Suggestions */}
          <div className="bg-white rounded-2xl flex-1 shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Suggestions
            </h2>

            <SuggestionsList
              suggestions={
                showSuggestions
                  ? result.suggestions
                  : result.suggestions.slice(0, PREVIEW_COUNT)
              }
            />

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowSuggestions((v) => !v)}
                className="text-sm flex font-medium cursor-pointer text-indigo-600 hover:text-indigo-800 transition"
              >
                {showSuggestions ? (
                  <>
                    Collapse suggestions <MdOutlineKeyboardArrowUp size={18} />
                  </>
                ) : (
                  <>
                    Expand suggestions <MdOutlineKeyboardArrowDown size={18} />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Roadmap */}
          <div className="bg-white rounded-2xl lg:w-1/2 shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Improvement Roadmap
            </h2>

            <Roadmap
              roadmap={
                showRoadmap
                  ? result.roadmap
                  : result.roadmap.slice(0, PREVIEW_COUNT)
              }
            />

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowRoadmap((v) => !v)}
                className="text-sm flex font-medium cursor-pointer text-indigo-600 hover:text-indigo-800 transition"
              >
                {showRoadmap ? (
                  <>
                    Collapse roadmaps <MdOutlineKeyboardArrowUp size={18} />
                  </>
                ) : (
                  <>
                    Expand roadmaps <MdOutlineKeyboardArrowDown size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
