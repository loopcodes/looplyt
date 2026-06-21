interface AuthorityCardProps {
  pageRank: number;
  rank: string | null;
}

function getAuthorityMeta(pageRank: number) {
  if (pageRank >= 7) {
    return {
      label: "Strong",
      color: "bg-green-100 text-green-700",
    };
  }

  if (pageRank >= 4) {
    return {
      label: "Average",
      color: "bg-yellow-100 text-yellow-700",
    };
  }

  return {
    label: "Weak",
    color: "bg-red-100 text-red-700",
  };
}

export default function AuthorityCard({
  pageRank,
  rank,
}: AuthorityCardProps) {
  const meta = getAuthorityMeta(pageRank);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-gray-500">
            Authority Score
          </p>

          <h2 className="text-4xl font-bold text-gray-800 mt-2">
            {pageRank.toFixed(1)}
          </h2>
        </div>

        {/* status badge */}
        <span
          className={`px-3 py-1 ml-2 rounded-full text-xs font-medium ${meta.color}`}
        >
          {meta.label}
        </span>
      </div>

      <div className="border-t pt-4">
        <p className="text-sm text-gray-500 mb-1">
          Visibility Rank
        </p>

        <p className="text-xl font-semibold text-indigo-700">
          {rank ? `#${Number(rank).toLocaleString()}` : "--"}
        </p>
      </div>
    </div>
  );
}