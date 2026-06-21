interface Props {
  metrics?: {
    lcp: number | null;
    speedIndex: number | null;
    tbt: number | null;
    cls: number | null;
  };
}

const formatTime = (ms: number | null) => {
  if (!ms && ms !== 0) return "--";
  return `${(ms / 1000).toFixed(3)}s`;
};

const formatCLS = (cls: number | null) => {
  if (cls == null) return "--";
  return cls.toFixed(3);
};

const getStatus = (value: number | null, type: "time" | "cls") => {
  if (value == null) return "N/A";

  if (type === "cls") {
    if (value <= 0.1) return "Good";
    if (value <= 0.25) return "Needs Improvement";
    return "Poor";
  }

  const seconds = value / 1000;
  if (seconds <= 2.5) return "Good";
  if (seconds <= 4) return "Needs Improvement";
  return "Poor";
};

export default function PerformanceBreakdown({ metrics }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Performance Breakdown
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {/* LCP */}
        <div className="p-4 rounded-xl bg-gray-50">
          <p className="text-xs text-gray-500">Largest Contentful Paint</p>
          <p className="text-lg font-bold text-indigo-600">
            {formatTime(metrics?.lcp ?? null)}
          </p>
          <p className="text-xs text-gray-400">
            {getStatus(metrics?.lcp ?? null, "time")}
          </p>
        </div>

        {/* CLS */}
        <div className="p-4 rounded-xl bg-gray-50">
          <p className="text-xs text-gray-500">Cumulative Layout Shift</p>
          <p className="text-lg font-bold text-indigo-600">
            {formatCLS(metrics?.cls ?? null)}
          </p>
          <p className="text-xs text-gray-400">
            {getStatus(metrics?.cls ?? null, "cls")}
          </p>
        </div>

        {/* Speed Index */}
        <div className="p-4 rounded-xl bg-gray-50">
          <p className="text-xs text-gray-500">Speed Index</p>
          <p className="text-lg font-bold text-indigo-600">
            {formatTime(metrics?.speedIndex ?? null)}
          </p>
          <p className="text-xs text-gray-400">
            {getStatus(metrics?.speedIndex ?? null, "time")}
          </p>
        </div>

        {/* TBT */}
        <div className="p-4 rounded-xl bg-gray-50">
          <p className="text-xs text-gray-500">Total Blocking Time</p>
          <p className="text-lg font-bold text-indigo-600">
            {formatTime(metrics?.tbt ?? null)}
          </p>
          <p className="text-xs text-gray-400">
            {getStatus(metrics?.tbt ?? null, "time")}
          </p>
        </div>

        
      </div>
    </div>
  );
}