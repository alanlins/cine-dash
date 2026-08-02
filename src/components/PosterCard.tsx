import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'
import { getImageUrl } from '@/lib/api'
import type { Movie, TVShow } from '@/types'

interface PosterCardProps {
  item: Movie | TVShow
  onClick?: () => void
}

function isMovie(item: Movie | TVShow): item is Movie {
  return 'title' in item
}

export function PosterCard({ item, onClick }: PosterCardProps) {
  const isMovieItem = isMovie(item)
  const title = isMovieItem ? item.title : item.name
  const dateStr = isMovieItem ? item.release_date : item.first_air_date
  const year = dateStr ? dateStr.split('-')[0] : 'N/A'
  const posterUrl = getImageUrl(item.poster_path, 'w342')
  const mediaType = isMovieItem ? 'movie' : 'tv'

  return (
    <Link
      to={`/details/${mediaType}/${item.id}`}
      onClick={onClick}
      className="group block rounded-lg overflow-hidden bg-slate-800 shadow-lg hover:shadow-xl transition transform hover:scale-105"
    >
      <div className="aspect-[2/3] overflow-hidden bg-slate-700">
        {posterUrl ? (
          <img src={posterUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <span className="text-sm">No poster</span>
          </div>
        )}
      </div>

      <div className="p-3 md:p-4">
        <h3 className="font-semibold text-sm md:text-base line-clamp-2 mb-2">{title}</h3>

        <div className="flex items-center justify-between text-xs md:text-sm">
          <span className="text-slate-400">{year}</span>

          <div className="flex items-center gap-1 bg-amber-500/20 text-amber-300 px-2 py-1 rounded">
            <Star size={14} fill="currentColor" />
            <span className="font-semibold">{item.vote_average.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
