interface Props {
  pageSpeed: number | null;
}

function getSpeedMeta(speed: number | null) {
  if (speed == null) {
    return {
      label: "N/A",
      color: "bg-gray-100 text-gray-600",
    };
  }

  if (speed <= 2) {
    return {
      label: "Excellent",
      color: "bg-green-100 text-green-700",
    };
  }

  if (speed <= 3) {
    return {
      label: "Fast",
      color: "bg-emerald-100 text-emerald-700",
    };
  }

  if (speed <= 5) {
    return {
      label: "Average",
      color: "bg-yellow-100 text-yellow-700",
    };
  }

  if (speed <= 8) {
    return {
      label: "Slow",
      color: "bg-orange-100 text-orange-700",
    };
  }

  return {
    label: "Very Slow",
    color: "bg-red-100 text-red-700",
  };
}

export default function PageSpeedCard({ pageSpeed }: Props) {
  const meta = getSpeedMeta(pageSpeed);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-sm text-gray-500">
            Page Speed
          </p>
        </div>

        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${meta.color}`}
        >
          {meta.label}
        </span>
      </div>


      {/* speed value */}
      <div className="flex items-end gap-2">
        <span className="text-4xl font-bold text-indigo-600 tabular-nums">
          {pageSpeed?.toFixed(2) ?? "--"}s
        </span>
      </div>
    </div>
  );
}