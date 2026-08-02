import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Star, Calendar, Clock, ArrowLeft } from 'lucide-react'
import { getMovieDetails, getTVDetails, getImageUrl } from '@/lib/api'
import { LoadingState } from '@/components/LoadingState'
import { ErrorState } from '@/components/ErrorState'
import type { Movie, TVShow } from '@/types'

export function Details() {
  const { mediaType, id } = useParams<{ mediaType: string; id: string }>()
  const navigate = useNavigate()
  const [item, setItem] = useState<Movie | TVShow | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isMovie = mediaType === 'movie'

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true)
        setError(null)

        if (!id) throw new Error('Invalid item ID')

        const details = isMovie ? await getMovieDetails(parseInt(id, 10)) : await getTVDetails(parseInt(id, 10))
        setItem(details)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load details')
      } finally {
        setLoading(false)
      }
    }

    fetchDetails()
  }, [id, isMovie])

  if (loading)
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <LoadingState />
      </div>
    )

  if (error) return <ErrorState error={error} onRetry={() => window.location.reload()} />

  if (!item)
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 text-center">
        <p className="text-slate-400">Item not found</p>
      </div>
    )

  const isMovieItem = 'title' in item
  const title = isMovieItem ? item.title : item.name
  const dateStr = isMovieItem ? item.release_date : item.first_air_date
  const year = dateStr ? dateStr.split('-')[0] : 'N/A'
  const runtime = isMovieItem ? item.runtime : item.episode_run_time?.[0]
  const posterUrl = getImageUrl(item.poster_path, 'w500')
  const backdropUrl = getImageUrl(item.backdrop_path, 'original')
  const cast = item.credits?.cast?.slice(0, 6) || []

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Backdrop */}
      {backdropUrl && (
        <div className="relative h-64 md:h-96 overflow-hidden">
          <img src={backdropUrl} alt={title} className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
          {/* Poster */}
          <div className="md:col-span-1">
            {posterUrl ? (
              <img src={posterUrl} alt={title} className="w-full rounded-lg shadow-2xl" />
            ) : (
              <div className="w-full aspect-[2/3] bg-slate-700 rounded-lg flex items-center justify-center text-slate-400">
                No poster
              </div>
            )}
          </div>

          {/* Details */}
          <div className="md:col-span-3">
            <h1 className="text-3xl md:text-5xl font-bold mb-2">{title}</h1>

            <div className="flex flex-wrap gap-3 mb-6 text-sm md:text-base">
              <div className="flex items-center gap-2 bg-amber-500/20 text-amber-300 px-3 py-1 rounded">
                <Star size={18} fill="currentColor" />
                <span className="font-semibold">{item.vote_average.toFixed(1)}/10</span>
              </div>

              <div className="flex items-center gap-2 bg-slate-700 text-slate-300 px-3 py-1 rounded">
                <Calendar size={18} />
                <span>{year}</span>
              </div>

              {runtime && (
                <div className="flex items-center gap-2 bg-slate-700 text-slate-300 px-3 py-1 rounded">
                  <Clock size={18} />
                  <span>{runtime} min</span>
                </div>
              )}
            </div>

            {/* Genres */}
            {item.genres && item.genres.length > 0 && (
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-slate-400 mb-2">Genres</h2>
                <div className="flex flex-wrap gap-2">
                  {item.genres.map((genre) => (
                    <span key={genre.id} className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm">
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Overview */}
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-2">Overview</h2>
              <p className="text-slate-300 leading-relaxed text-sm md:text-base">{item.overview || 'No overview available'}</p>
            </div>

            {/* Stats */}
            <div className="bg-slate-800 rounded-lg p-4 md:p-6 mb-8">
              <h2 className="text-lg font-bold mb-4">Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 text-sm">Vote Count</p>
                  <p className="text-2xl font-bold">{item.vote_count.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Popularity</p>
                  <p className="text-2xl font-bold">{item.popularity.toFixed(1)}</p>
                </div>
              </div>
            </div>

            {/* Cast */}
            {cast.length > 0 && (
              <div>
                <h2 className="text-lg font-bold mb-4">Cast</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {cast.map((member) => {
                    const profileUrl = member.profile_path ? getImageUrl(member.profile_path, 'w342') : null
                    return (
                      <div key={member.id} className="bg-slate-800 rounded-lg overflow-hidden">
                        {profileUrl ? (
                          <img src={profileUrl} alt={member.name} className="w-full aspect-square object-cover" />
                        ) : (
                          <div className="w-full aspect-square bg-slate-700 flex items-center justify-center text-slate-400 text-xs">
                            No image
                          </div>
                        )}
                        <div className="p-3">
                          <p className="font-semibold text-sm line-clamp-1">{member.name}</p>
                          <p className="text-slate-400 text-xs line-clamp-1">{member.character}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
