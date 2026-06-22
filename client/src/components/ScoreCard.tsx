interface Props {
  label: string;
  score: number | null;
}

export default function ScoreCard({ label, score }: Props) {
  return (
    <div className="p-4 backdrop-blur-xl bg-linear-to-br from-indigo-400/10 via-purple-400/10 to-sky-400/10 rounded-2xl text-center">
      <h3 className="text-lg font-medium">{label}</h3>

      <p className="text-2xl font-bold tabular-nums">
        {score ?? "--"}%
      </p>
    </div>
  );
}