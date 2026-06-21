interface Props {
  roadmap: { task: string; impact: string }[];
}

export default function Roadmap({ roadmap }: Props) {
  return (
    <ol className="list-disc pl-5 space-y-2">
      {roadmap.map((item, i) => (
        <li key={i}>
          {item.task} <span className="text-sm text-gray-500">({item.impact})</span>
        </li>
      ))}
    </ol>
  );
}