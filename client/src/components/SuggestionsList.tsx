interface Props {
  suggestions: string[];
}

export default function SuggestionsList({ suggestions }: Props) {
  return (
    <ul className="list-disc pl-5 space-y-2">
      {suggestions.map((s, i) => (
        <li key={i}>{s}</li>
      ))}
      
    </ul>
  );
}