import { Filter } from 'lucide-react'
import type { Genre } from '@/types'

interface FilterControlsProps {
  mediaType: 'movie' | 'tv'
  selectedGenre: number | null
  selectedYear: number | null
  genres: Genre[]
  onMediaTypeChange: (type: 'movie' | 'tv') => void
  onGenreChange: (genreId: number | null) => void
  onYearChange: (year: number | null) => void
}

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 30 }, (_, i) => currentYear - i)

export function FilterControls({
  mediaType,
  selectedGenre,
  selectedYear,
  genres,
  onMediaTypeChange,
  onGenreChange,
  onYearChange,
}: FilterControlsProps) {
  return (
    <div className="bg-slate-800 rounded-lg p-4 md:p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter size={20} className="text-primary" />
        <h2 className="text-lg font-bold">Filters</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Media Type */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-slate-300">Type</label>
          <select
            value={mediaType}
            onChange={(e) => onMediaTypeChange(e.target.value as 'movie' | 'tv')}
            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-primary"
          >
            <option value="movie">Movies</option>
            <option value="tv">TV Shows</option>
          </select>
        </div>

        {/* Genre */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-slate-300">Genre</label>
          <select
            value={selectedGenre || ''}
            onChange={(e) => onGenreChange(e.target.value ? parseInt(e.target.value, 10) : null)}
            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-primary"
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>

        {/* Year */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-slate-300">Year</label>
          <select
            value={selectedYear || ''}
            onChange={(e) => onYearChange(e.target.value ? parseInt(e.target.value, 10) : null)}
            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-primary"
          >
            <option value="">All Years</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
