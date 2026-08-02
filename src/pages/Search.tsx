import { useEffect, useState } from 'react'
import { searchMovies, searchTV } from '@/lib/api'
import { PosterCard } from '@/components/PosterCard'
import { LoadingState } from '@/components/LoadingState'
import { ErrorState } from '@/components/ErrorState'
import { SearchInput } from '@/components/SearchInput'
import type { Movie, TVShow } from '@/types'

export function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<(Movie | TVShow)[]>([])
  const [mediaType, setMediaType] = useState<'movie' | 'tv'>('movie')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setHasSearched(false)
      setError(null)
      return
    }

    const performSearch = async () => {
      try {
        setLoading(true)
        setError(null)
        setHasSearched(true)

        const response = mediaType === 'movie' ? await searchMovies(query, 1) : await searchTV(query, 1)
        setResults(response.results.slice(0, 20))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed')
      } finally {
        setLoading(false)
      }
    }

    performSearch()
  }, [query, mediaType])

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Search</h1>

        <SearchInput value={query} onChange={setQuery} placeholder="Search for movies or TV shows..." />

        {/* Media Type Toggle */}
        <div className="flex gap-2 mt-4">
          {(['movie', 'tv'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setMediaType(type)}
              className={`px-4 py-2 rounded font-semibold transition ${
                mediaType === type ? 'bg-primary text-white' : 'bg-slate-700 hover:bg-slate-600'
              }`}
            >
              {type === 'movie' ? 'Movies' : 'TV Shows'}
            </button>
          ))}
        </div>
      </div>

      {error && <ErrorState error={error} onRetry={() => setQuery(query)} />}

      {!hasSearched && (
        <div className="text-center py-12">
          <p className="text-slate-400 text-lg">Enter a search term to find movies and TV shows</p>
        </div>
      )}

      {hasSearched && loading && <LoadingState />}

      {hasSearched && !loading && results.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-400 text-lg">No results found for "{query}"</p>
        </div>
      )}

      {results.length > 0 && !loading && (
        <>
          <p className="text-slate-400 mb-6">Found {results.length} results</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {results.map((item) => (
              <PosterCard key={item.id} item={item} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
