import { describe, it, expect } from 'vitest'
import { getTopRated, getMostPopular, getGenreDistribution, getRatingByYear } from './rankings'
import type { Movie } from '@/types'

const mockMovies: Movie[] = [
  {
    id: 1,
    title: 'Movie 1',
    overview: 'Overview 1',
    poster_path: '/path1.jpg',
    backdrop_path: '/path1_bg.jpg',
    release_date: '2023-01-15',
    vote_average: 8.5,
    vote_count: 300,
    popularity: 100,
    genre_ids: [1, 2],
  },
  {
    id: 2,
    title: 'Movie 2',
    overview: 'Overview 2',
    poster_path: '/path2.jpg',
    backdrop_path: '/path2_bg.jpg',
    release_date: '2023-06-20',
    vote_average: 9.0,
    vote_count: 250,
    popularity: 85,
    genre_ids: [1, 3],
  },
  {
    id: 3,
    title: 'Movie 3',
    overview: 'Overview 3',
    poster_path: '/path3.jpg',
    backdrop_path: '/path3_bg.jpg',
    release_date: '2024-03-10',
    vote_average: 10.0,
    vote_count: 2,
    popularity: 50,
    genre_ids: [2],
  },
  {
    id: 4,
    title: 'Movie 4',
    overview: 'Overview 4',
    poster_path: '/path4.jpg',
    backdrop_path: '/path4_bg.jpg',
    release_date: '2022-12-01',
    vote_average: 7.0,
    vote_count: 150,
    popularity: 60,
    genre_ids: [3],
  },
]

const mockGenres = new Map([
  [1, 'Action'],
  [2, 'Drama'],
  [3, 'Comedy'],
])

describe('rankings', () => {
  describe('getTopRated', () => {
    it('filters out items with vote count below minimum threshold', () => {
      const topRated = getTopRated(mockMovies)
      // Movie 3 has only 2 votes, should be filtered out
      expect(topRated.map((m) => m.id)).not.toContain(3)
    })

    it('sorts by rating descending', () => {
      const topRated = getTopRated(mockMovies)
      expect(topRated[0].rating).toBe(9.0) // Movie 2
      expect(topRated[1].rating).toBe(8.5) // Movie 1
    })

    it('limits results to specified count', () => {
      const topRated = getTopRated(mockMovies, 2)
      expect(topRated).toHaveLength(2)
    })

    it('uses vote count as tiebreaker', () => {
      const tied = getTopRated([
        { ...mockMovies[0], vote_average: 8.0, vote_count: 300 },
        { ...mockMovies[1], vote_average: 8.0, vote_count: 100 },
      ])
      expect(tied[0].voteCount).toBe(300)
    })
  })

  describe('getMostPopular', () => {
    it('sorts by popularity descending', () => {
      const popular = getMostPopular(mockMovies)
      expect(popular[0].id).toBe(1) // popularity: 100
      expect(popular[1].id).toBe(2) // popularity: 85
    })

    it('limits results to specified count', () => {
      const popular = getMostPopular(mockMovies, 2)
      expect(popular).toHaveLength(2)
    })

    it('uses vote count as secondary sort', () => {
      const tied = getMostPopular([
        { ...mockMovies[0], popularity: 100, vote_count: 200 },
        { ...mockMovies[1], popularity: 100, vote_count: 400 },
      ])
      expect(tied[0].voteCount).toBe(400)
    })
  })

  describe('getGenreDistribution', () => {
    it('counts genres across items', () => {
      const distribution = getGenreDistribution(mockMovies, mockGenres)
      const actionCount = distribution.find((g) => g.name === 'Action')?.count
      expect(actionCount).toBe(2) // Movies 1 and 2
    })

    it('sorts by count descending', () => {
      const distribution = getGenreDistribution(mockMovies, mockGenres)
      expect(distribution[0].count).toBeGreaterThanOrEqual(distribution[1].count)
    })

    it('handles unknown genre IDs gracefully', () => {
      const items: Movie[] = [
        {
          ...mockMovies[0],
          genre_ids: [1, 999], // 999 is not in mockGenres
        },
      ]
      const distribution = getGenreDistribution(items, mockGenres)
      expect(distribution.map((g) => g.name)).not.toContain(undefined)
    })
  })

  describe('getRatingByYear', () => {
    it('calculates average rating by year', () => {
      const byYear = getRatingByYear(mockMovies)
      const year2023 = byYear.find((y) => y.year === 2023)
      // Movies 1 (8.5) and 2 (9.0) from 2023
      expect(year2023?.avgRating).toBe(8.8)
    })

    it('counts items per year', () => {
      const byYear = getRatingByYear(mockMovies)
      const year2023 = byYear.find((y) => y.year === 2023)
      expect(year2023?.count).toBe(2)
    })

    it('sorts by year ascending', () => {
      const byYear = getRatingByYear(mockMovies)
      for (let i = 0; i < byYear.length - 1; i++) {
        expect(byYear[i].year).toBeLessThanOrEqual(byYear[i + 1].year)
      }
    })

    it('filters out invalid dates', () => {
      const items: Movie[] = [
        { ...mockMovies[0], release_date: '' },
        mockMovies[1],
      ]
      const byYear = getRatingByYear(items)
      expect(byYear.filter((y) => y.year === 0)).toHaveLength(0)
    })
  })
})
