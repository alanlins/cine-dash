import type { Movie, TVShow, RankingItem } from '@/types'

const MINIMUM_VOTE_COUNT = 200

function isMovie(item: Movie | TVShow): item is Movie {
  return 'title' in item
}

function extractRankingItem(item: Movie | TVShow): RankingItem {
  const isMovieItem = isMovie(item)
  const title = isMovieItem ? item.title : item.name
  const year = isMovieItem ? item.release_date : item.first_air_date
  const yearStr = year ? year.split('-')[0] : 'N/A'

  return {
    id: item.id,
    title,
    rating: item.vote_average,
    voteCount: item.vote_count,
    year: parseInt(yearStr, 10) || 0,
    posterPath: item.poster_path,
  }
}

/**
 * Get top-rated titles with a minimum vote count threshold
 * Ensures titles with 2 votes at 10.0 don't rank #1
 */
export function getTopRated(items: (Movie | TVShow)[], limit: number = 20): RankingItem[] {
  return items
    .filter((item) => item.vote_count >= MINIMUM_VOTE_COUNT)
    .map(extractRankingItem)
    .sort((a, b) => {
      if (b.rating !== a.rating) {
        return b.rating - a.rating
      }
      return b.voteCount - a.voteCount
    })
    .slice(0, limit)
}

/**
 * Get most popular titles based on popularity score and vote count
 */
export function getMostPopular(items: (Movie | TVShow)[], limit: number = 20): RankingItem[] {
  return items
    .map((item) => ({
      ...extractRankingItem(item),
      popularity: 'popularity' in item ? item.popularity : 0,
    }))
    .sort((a, b) => {
      if (b.popularity !== a.popularity) {
        return b.popularity - a.popularity
      }
      return b.voteCount - a.voteCount
    })
    .slice(0, limit)
    .map(({ popularity, ...rest }) => rest)
}

/**
 * Calculate genre distribution from items
 */
export function getGenreDistribution(
  items: (Movie | TVShow)[],
  genreMap: Map<number, string>,
): Array<{ name: string; count: number }> {
  const distribution = new Map<string, number>()

  for (const item of items) {
    for (const genreId of item.genre_ids) {
      const genreName = genreMap.get(genreId)
      if (genreName) {
        distribution.set(genreName, (distribution.get(genreName) || 0) + 1)
      }
    }
  }

  return Array.from(distribution.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}

/**
 * Calculate average rating by release year
 */
export function getRatingByYear(items: (Movie | TVShow)[]): Array<{ year: number; avgRating: number; count: number }> {
  const yearData = new Map<number, { total: number; count: number }>()

  for (const item of items) {
    const isMovieItem = isMovie(item)
    const dateStr = isMovieItem ? item.release_date : item.first_air_date
    const year = dateStr ? parseInt(dateStr.split('-')[0], 10) : null

    if (year && year > 0) {
      const current = yearData.get(year) || { total: 0, count: 0 }
      yearData.set(year, {
        total: current.total + item.vote_average,
        count: current.count + 1,
      })
    }
  }

  return Array.from(yearData.entries())
    .map(([year, data]) => ({
      year,
      avgRating: Math.round((data.total / data.count) * 10) / 10,
      count: data.count,
    }))
    .sort((a, b) => a.year - b.year)
}
