import { describe, it, expect } from 'vitest'
import { isApiKeyConfigured, getMissingKeyError } from './api'

describe('API Configuration', () => {
  it('provides a helpful error message for missing API key', () => {
    const error = getMissingKeyError()
    expect(error).toContain('VITE_TMDB_API_KEY')
    expect(error).toContain('.env')
    expect(error).toContain('themoviedb.org')
  })

  it('has a function to check if API key is configured', () => {
    expect(typeof isApiKeyConfigured).toBe('function')
  })
})
