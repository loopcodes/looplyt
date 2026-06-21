interface Props {
  url: string;
  setUrl: (u: string) => void;
}

export default function URLInput({ url, setUrl }: Props) {
  const handleChange = (value: string) => {
    let input = value.trim();

    // Remove accidental spaces
    input = input.replace(/\s+/g, "");

    setUrl(input);
  };

  return (
    <div className="relative w-full">


      <input
        type="text"
        value={url}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Enter URL (e.g. google.com)"
        className="w-full p-4 rounded-2xl bg-white/60 backdrop-blur-md shadow-md text-gray-800 placeholder:text-gray-400 placeholder:text-sm outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition"
      />
    </div>
  );
}