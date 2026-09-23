import { Link } from "react-router-dom";
import { HiLocationMarker } from "react-icons/hi";

/** Catch-all 404 page. */
function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
      <HiLocationMarker
        className="h-16 w-16 text-indigo-300 dark:text-indigo-900"
        aria-hidden="true"
      />
      <p className="mt-6 text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
        404
      </p>
      <h1 className="mt-2 text-lg font-bold text-slate-800 dark:text-slate-100">
        Page not found
      </h1>
      <p className="mt-1 max-w-sm text-sm text-slate-400">
        The page you are looking for does not exist or has moved.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn-primary">
          Back home
        </Link>
        <Link to="/hotels" className="btn-ghost">
          Explore stays
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
