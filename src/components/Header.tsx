import { Film } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function Header() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
        <div className="flex items-center justify-between mb-4 md:mb-0">
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-2xl hover:text-primary-light transition"
          >
            <Film size={28} />
            <span>CineDash</span>
          </Link>

          <nav className="flex gap-1 md:gap-4 text-sm md:text-base">
            <Link
              to="/"
              className={`px-3 py-2 rounded transition ${
                isActive("/") ? "bg-primary text-white" : "hover:bg-slate-800"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/top-rated"
              className={`px-3 py-2 rounded transition ${
                isActive("/top-rated")
                  ? "bg-primary text-white"
                  : "hover:bg-slate-800"
              }`}
            >
              Top Rated
            </Link>
            <Link
              to="/popular"
              className={`px-3 py-2 rounded transition ${
                isActive("/popular")
                  ? "bg-primary text-white"
                  : "hover:bg-slate-800"
              }`}
            >
              Popular
            </Link>
            <Link
              to="/search"
              className={`px-3 py-2 rounded transition ${
                isActive("/search")
                  ? "bg-primary text-white"
                  : "hover:bg-slate-800"
              }`}
            >
              Search
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
