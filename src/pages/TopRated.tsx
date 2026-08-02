import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import { discoverMovies, discoverTV, getImageUrl, getMovieGenres, getTVGenres } from '@/lib/api'
import { getTopRated } from '@/lib/rankings'
import { LoadingState } from '@/components/LoadingState'
import { ErrorState } from '@/components/ErrorState'
import { FilterControls } from '@/components/FilterControls'
import type { Genre, RankingItem } from '@/types'
import { Link } from 'react-router-dom'

export function TopRated() {
  const [rankings, setRankings] = useState<RankingItem[]>([])
  const [genres, setGenres] = useState<Genre[]>([])
  const [mediaType, setMediaType] = useState<'movie' | 'tv'>('movie')
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null)
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch genres
      const genreResponse = mediaType === 'movie' ? await getMovieGenres() : await getTVGenres()
      setGenres(genreResponse.genres)

      // Fetch discover data
      const params: any = { sort_by: 'vote_average.desc' }
      if (selectedGenre) params.with_genres = selectedGenre
      if (selectedYear) {
        if (mediaType === 'movie') {
          params.primary_release_year = selectedYear
        } else {
          params.first_air_date_year = selectedYear
        }
      }

      const discoverResponse = mediaType === 'movie' ? await discoverMovies(params) : await discoverTV(params)
      const topRatedList = getTopRated(discoverResponse.results, 50)
      setRankings(topRatedList)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [mediaType, selectedGenre, selectedYear])

  if (error) return <ErrorState error={error} onRetry={fetchData} />

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Melhor avaliados / Top Rated</h1>
        <p className="text-slate-400 text-sm md:text-base mb-6">Ranked by TMDB user vote average (minimum {200} votes to qualify)</p>
      </div>

      <FilterControls
        mediaType={mediaType}
        selectedGenre={selectedGenre}
        selectedYear={selectedYear}
        genres={genres}
        onMediaTypeChange={setMediaType}
        onGenreChange={setSelectedGenre}
        onYearChange={setSelectedYear}
      />

      {loading ? (
        <LoadingState />
      ) : rankings.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <p>No results found with current filters</p>
        </div>
      ) : (
        <div className="space-y-2">
          {rankings.map((item, index) => {
            const posterUrl = getImageUrl(item.posterPath, 'w342')
            const mediaTypeStr = mediaType

            return (
              <Link
                key={item.id}
                to={`/details/${mediaTypeStr}/${item.id}`}
                className="flex gap-4 bg-slate-800 hover:bg-slate-700 rounded-lg p-4 transition group"
              >
                <div className="flex-shrink-0 w-16 h-24 rounded overflow-hidden bg-slate-700">
                  {posterUrl ? (
                    <img src={posterUrl} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No image</div>
                  )}
                </div>

                <div className="flex-grow min-w-0">
                  <div className="flex items-start gap-3 mb-1">
                    <span className="text-2xl font-bold text-primary flex-shrink-0">#{index + 1}</span>
                    <div className="min-w-0 flex-grow">
                      <h3 className="font-bold text-base md:text-lg group-hover:text-primary transition truncate">{item.title}</h3>
                      <p className="text-slate-400 text-sm">{item.year}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 bg-amber-500/20 text-amber-300 px-3 py-1 rounded">
                      <Star size={16} fill="currentColor" />
                      <span className="font-semibold">{item.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-slate-400 text-sm">{item.voteCount.toLocaleString()} votes</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
