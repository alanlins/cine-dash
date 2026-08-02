import type {
  DiscoverResponse,
  GenreList,
  Movie,
  SearchResponse,
  TrendingResponse,
  TVShow,
} from '@/types'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'

// Check if API key is configured
export function isApiKeyConfigured(): boolean {
  return !!API_KEY
}

// Get error message for missing API key
export function getMissingKeyError(): string {
  return `TMDB API key is not configured. Create a .env file in the project root with: VITE_TMDB_API_KEY=your_key_here. Get a free key at https://www.themoviedb.org/settings/api`
}

async function fetchFromAPI<T>(endpoint: string, params: Record<string, string | number> = {}): Promise<T> {
  if (!isApiKeyConfigured()) {
    throw new Error(getMissingKeyError())
  }

  const url = new URL(`${BASE_URL}${endpoint}`)
  url.searchParams.append('api_key', API_KEY)

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.append(key, String(value))
  }

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

// Trending
export async function getTrendingMovies(timeWindow: 'day' | 'week' = 'week'): Promise<TrendingResponse> {
  return fetchFromAPI(`/trending/movie/${timeWindow}`)
}

export async function getTrendingTV(timeWindow: 'day' | 'week' = 'week'): Promise<TrendingResponse> {
  return fetchFromAPI(`/trending/tv/${timeWindow}`)
}

// Discover
export async function discoverMovies(params: {
  page?: number
  sort_by?: string
  with_genres?: string
  primary_release_year?: number
  release_date_gte?: string
  release_date_lte?: string
} = {}): Promise<DiscoverResponse> {
  return fetchFromAPI('/discover/movie', { page: 1, ...params })
}

export async function discoverTV(params: {
  page?: number
  sort_by?: string
  with_genres?: string
  first_air_date_year?: number
  air_date_gte?: string
  air_date_lte?: string
} = {}): Promise<DiscoverResponse> {
  return fetchFromAPI('/discover/tv', { page: 1, ...params })
}

// Genres
export async function getMovieGenres(): Promise<GenreList> {
  return fetchFromAPI('/genre/movie/list')
}

export async function getTVGenres(): Promise<GenreList> {
  return fetchFromAPI('/genre/tv/list')
}

// Search
export async function searchMovies(query: string, page: number = 1): Promise<SearchResponse> {
  return fetchFromAPI('/search/movie', { query, page })
}

export async function searchTV(query: string, page: number = 1): Promise<SearchResponse> {
  return fetchFromAPI('/search/tv', { query, page })
}

// Details
export async function getMovieDetails(id: number): Promise<Movie> {
  return fetchFromAPI(`/movie/${id}`, { append_to_response: 'credits' })
}

export async function getTVDetails(id: number): Promise<TVShow> {
  return fetchFromAPI(`/tv/${id}`, { append_to_response: 'credits' })
}

// Image URL builder
export function getImageUrl(path: string | null, size: 'w500' | 'w342' | 'original' = 'w500'): string {
  if (!path) return ''
  return `https://image.tmdb.org/t/p/${size}${path}`
}
