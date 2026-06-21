import { Link, useLocation } from "react-router-dom";
import { TbWorldSearch } from "react-icons/tb";

export default function Navbar() {
  const location = useLocation();

  const state = location.state as { url: string } | null;

  const url = state?.url;

  const hostname = url
    ? new URL(url).hostname
    : "";

  return (
    <nav className="sticky top-0 z-50 w-full border-none backdrop-blur-md shadow-sm bg-linear-to-br from-indigo-400/10 via-purple-400/10 to-sky-400/10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-bold tracking-tight text-gray-800 hover:text-indigo-600 transition"
        >
          <span className="text-indigo-600">∞</span>plyt
        </Link>

        <p className="text-gray-500 mt-2 break-all">
          {hostname}
        </p>

        {/* Action Button */}
        <Link
          to="/"
          className="inline-flex items-center text-2xl gap-2 cursor-pointer rounded-full text-white bg-indigo-600 px-4 py-2 font-medium  hover:shadow-lg shadow-indigo-600 transition "
        >
          <TbWorldSearch />
        </Link>
      </div>
    </nav>
  );
}