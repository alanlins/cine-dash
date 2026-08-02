export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  popularity: number
  genre_ids: number[]
  runtime?: number
  genres?: Genre[]
  credits?: Credits
}

export interface TVShow {
  id: number
  name: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  first_air_date: string
  vote_average: number
  vote_count: number
  popularity: number
  genre_ids: number[]
  episode_run_time?: number[]
  genres?: Genre[]
  credits?: Credits
}

export type MediaItem = Movie | TVShow

export interface Genre {
  id: number
  name: string
}

export interface GenreList {
  genres: Genre[]
}

export interface DiscoverResponse {
  page: number
  results: (Movie | TVShow)[]
  total_pages: number
  total_results: number
}

export interface TrendingResponse {
  page: number
  results: MediaItem[]
  total_pages: number
  total_results: number
}

export interface SearchResponse {
  page: number
  results: (Movie | TVShow)[]
  total_pages: number
  total_results: number
}

export interface Credits {
  cast?: CastMember[]
}

export interface CastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
}

export interface RankingItem {
  id: number
  title: string
  rating: number
  voteCount: number
  year: number
  posterPath: string | null
}
