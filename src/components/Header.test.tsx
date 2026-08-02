import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Header } from './Header'
import { describe, it, expect } from 'vitest'

describe('Header', () => {
  it('renders the header with logo and title', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>,
    )

    expect(screen.getByText('CineDash')).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>,
    )

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Top Rated')).toBeInTheDocument()
    expect(screen.getByText('Popular')).toBeInTheDocument()
    expect(screen.getByText('Search')).toBeInTheDocument()
  })
})
