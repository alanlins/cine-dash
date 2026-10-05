import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  getTrendingMovies,
  getTrendingTV,
  getMovieGenres,
  getTVGenres,
  discoverMovies,
  discoverTV,
} from "@/lib/api";
import { getGenreDistribution, getRatingByYear } from "@/lib/rankings";
import { PosterCard } from "@/components/PosterCard";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import type { Movie, TVShow } from "@/types";

const COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#06b6d4",
  "#ef4444",
  "#f43f5e",
];

export function Dashboard() {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [trendingTV, setTrendingTV] = useState<TVShow[]>([]);
  const [discoverData, setDiscoverData] = useState<(Movie | TVShow)[]>([]);
  const [mediaType, setMediaType] = useState<"movie" | "tv">("movie");
  const [timeWindow, setTimeWindow] = useState<"day" | "week">("week");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [genreDistribution, setGenreDistribution] = useState<
    Array<{ name: string; count: number }>
  >([]);
  const [ratingByYear, setRatingByYear] = useState<
    Array<{ year: number; avgRating: number; count: number }>
  >([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch genres
      const movieGenres = await getMovieGenres();
      const tvGenres = await getTVGenres();
      const allGenres = [...movieGenres.genres, ...tvGenres.genres];
      const genreMapLocal = new Map(allGenres.map((g) => [g.id, g.name]));

      // Fetch trending
      const [movies, shows] = await Promise.all([
        getTrendingMovies(timeWindow),
        getTrendingTV(timeWindow),
      ]);
      setTrendingMovies(movies.results.slice(0, 20) as Movie[]);
      setTrendingTV(shows.results.slice(0, 20) as TVShow[]);

      // Fetch discover data for charts
      const discoverResponse =
        mediaType === "movie"
          ? await discoverMovies({ page: 1, sort_by: "popularity.desc" })
          : await discoverTV({ page: 1, sort_by: "popularity.desc" });
      setDiscoverData(discoverResponse.results);

      // Calculate chart data
      const distribution = getGenreDistribution(
        discoverResponse.results,
        genreMapLocal,
      );
      setGenreDistribution(distribution);

      const ratingYear = getRatingByYear(discoverResponse.results);
      setRatingByYear(ratingYear);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [mediaType, timeWindow]);

  if (error) return <ErrorState error={error} onRetry={fetchData} />;

  const displayItems = mediaType === "movie" ? trendingMovies : trendingTV;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 flex items-center justify-center">
          Dashboard
        </h1>

        {/* Trending Controls */}
        <div className="bg-slate-800 rounded-lg p-4 md:p-6 mb-8">
          <h2 className="text-lg font-bold mb-4 flex items-center justify-center">
            Trending
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {(["movie", "tv"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setMediaType(type)}
                className={`px-4 py-2 rounded font-semibold transition ${
                  mediaType === type
                    ? "bg-primary text-white"
                    : "bg-slate-700 hover:bg-slate-600"
                }`}
              >
                {type === "movie" ? "Movies" : "TV Shows"}
              </button>
            ))}
            {(["day", "week"] as const).map((window) => (
              <button
                key={window}
                onClick={() => setTimeWindow(window)}
                className={`px-4 py-2 rounded font-semibold transition ${
                  timeWindow === window
                    ? "bg-primary text-white"
                    : "bg-slate-700 hover:bg-slate-600"
                }`}
              >
                {window === "day" ? "Today" : "This Week"}
              </button>
            ))}
          </div>
        </div>

        {/* Trending Grid */}
        {loading ? (
          <LoadingState />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 mb-8">
            {displayItems.map((item) => (
              <PosterCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* Charts Section */}
      {!loading && discoverData.length > 0 && (
        <div className="space-y-8">
          {/* Genre Distribution */}
          {genreDistribution.length > 0 && (
            <div className="bg-slate-800 rounded-lg p-4 md:p-6">
              <h2 className="text-xl font-bold mb-6">Genre Distribution</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Bar Chart */}
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={genreDistribution.slice(0, 8)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="name"
                      stroke="#9ca3af"
                      angle={-45}
                      textAnchor="end"
                      height={100}
                    />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "none",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>

                {/* Pie Chart */}
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={genreDistribution.slice(0, 6)}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry: any) => `${entry.name}: ${entry.count}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {genreDistribution.slice(0, 6).map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "none",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Rating by Year */}
          {ratingByYear.length > 0 && (
            <div className="bg-slate-800 rounded-lg p-4 md:p-6">
              <h2 className="text-xl font-bold mb-6">Average Rating by Year</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={ratingByYear.slice(-20)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="year" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" domain={[0, 10]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "none",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="avgRating"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ fill: "#8b5cf6", r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Avg Rating"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
