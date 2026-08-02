import { AlertCircle, RefreshCw } from 'lucide-react'

interface ErrorStateProps {
  error: string
  onRetry?: () => void
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const isMissingApiKey = error.includes('VITE_TMDB_API_KEY')

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <AlertCircle size={48} className="text-error mb-4" />
      <h2 className="text-xl md:text-2xl font-bold text-slate-100 mb-2">Something went wrong</h2>

      <div className="max-w-md bg-slate-800 rounded-lg p-4 md:p-6 mb-6">
        {isMissingApiKey ? (
          <>
            <p className="text-slate-300 text-sm md:text-base mb-4">
              To use CineDash, you need to set up your TMDB API key:
            </p>
            <ol className="text-slate-400 text-sm space-y-2 mb-4">
              <li>1. Get a free API key from https://www.themoviedb.org/settings/api</li>
              <li>2. Create a .env file in the project root</li>
              <li>3. Add: VITE_TMDB_API_KEY=your_key_here</li>
              <li>4. Restart the development server</li>
            </ol>
          </>
        ) : (
          <p className="text-slate-300 text-sm md:text-base break-words">{error}</p>
        )}
      </div>

      {onRetry && !isMissingApiKey && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 bg-primary hover:bg-primary-light text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          <RefreshCw size={18} />
          Try Again
        </button>
      )}
    </div>
  )
}
