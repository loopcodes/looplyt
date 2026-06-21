import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="text-center mt-20">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="mb-4">Page Not Found</p>
      <Link to="/" className="text-indigo-600 hover:underline">Go back home</Link>
    </div>
  );
}