# CineDash

A modern, responsive movies & TV shows stats dashboard built with React, TypeScript, and Tailwind CSS. Browse trending content, explore top-rated titles, discover popular shows, and search across the TMDB database.

## Features

- **Dashboard**: View trending movies and TV shows with toggle between media types and time windows
- **Charts**: Visual analysis with genre distribution (bar & pie charts) and average rating by year (line chart)
- **Top Rated**: Discover the best-rated titles (with minimum vote threshold to avoid gaming)
- **Most Popular**: Find trending content based on popularity metrics
- **Search**: Search for movies and TV shows with real-time results
- **Details**: View comprehensive information about any title including synopsis, cast, genres, and ratings
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop

## Tech Stack

- **Vite** + **React 19** + **TypeScript** - Fast, type-safe development
- **Tailwind CSS v4** - Utility-first styling with custom theme variables
- **Recharts** - Data visualization for charts
- **React Router** - Client-side routing
- **Vitest** + **@testing-library/react** - Unit and component testing
- **TMDB API** - Movie and TV show data

## Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm

### Setup

1. **Clone or navigate to the project**:
   ```bash
   cd cine-dash
   ```

2. **Get a free TMDB API key**:
   - Visit [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
   - Sign up or log in to your TMDB account (free)
   - Request an API key for personal use
   - Copy your API key

3. **Configure environment**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and paste your TMDB API key:
   ```
   VITE_TMDB_API_KEY=your_api_key_here
   ```

4. **Install dependencies**:
   ```bash
   npm install
   ```

### Running the App

**Development mode** (with hot reload):
```bash
npm run dev
```
Opens at `http://localhost:5173` (or another port if 5173 is in use)

**Build for production**:
```bash
npm run build
```

**Preview production build**:
```bash
npm run preview
```

### Testing

**Run tests in watch mode**:
```bash
npm run test
```

**Run tests once**:
```bash
npm run test:run
```

**Type checking**:
```bash
npx tsc -b --noEmit
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx      # Navigation header
│   ├── PosterCard.tsx  # Movie/TV show card
│   ├── LoadingState.tsx # Skeleton loaders
│   ├── ErrorState.tsx  # Error messages
│   ├── FilterControls.tsx # Genre/year filters
│   └── SearchInput.tsx # Debounced search
├── pages/              # Page components
│   ├── Dashboard.tsx   # Trending & charts
│   ├── TopRated.tsx    # Top-rated rankings
│   ├── Popular.tsx     # Most popular rankings
│   ├── Search.tsx      # Search interface
│   └── Details.tsx     # Title detail view
├── lib/
│   ├── api.ts         # TMDB API functions
│   └── rankings.ts    # Ranking/stats logic
├── types/
│   └── index.ts       # TypeScript definitions
├── test/
│   └── setup.ts       # Vitest configuration
├── App.tsx            # Main app router
├── main.tsx           # App entry point
└── index.css          # Global styles (Tailwind v4)
```

## API Details

CineDash uses the [TMDB REST API v3](https://developer.themoviedb.org/docs) with these key endpoints:

- `/trending/{media_type}/{time_window}` - Trending content
- `/discover/movie`, `/discover/tv` - Discover & filter titles
- `/genre/movie/list`, `/genre/tv/list` - Genre mappings
- `/search/movie`, `/search/tv` - Search functionality
- `/movie/{id}`, `/tv/{id}` - Detailed title information (with credits)

Images are served from `https://image.tmdb.org/t/p/` with configurable sizes.

## Development Notes

### Architecture

- **Client-only**: All TMDB API calls happen directly from the browser (no backend)
- **Functional components**: Leverages React hooks for state management
- **Custom ranking logic**: Implements minimum vote threshold for "Top Rated" to avoid low-vote outliers
- **Responsive grid**: Adapts from 2 columns on mobile to 5 on desktop

### Testing Strategy

- **Component tests**: Verify render and user interactions
- **Unit tests**: Test ranking/stats calculation functions
- **API tests**: Verify error handling for missing configuration

### TypeScript

Strict type safety with interfaces for all data structures. Path alias `@/` is configured for cleaner imports.

## Limitations & Future Enhancements

- No pagination UI (loads first page of results)
- No user authentication or favorites system
- No offline mode (requires internet connection)
- Charts render top genres/years only (scalable to full dataset)

## License

Open source portfolio project. Feel free to use as reference.

## Author

Alan Lins - Senior Fullstack Developer

---

**Questions about TMDB?** Check their [official documentation](https://developer.themoviedb.org/docs)
