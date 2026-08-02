import { Search, X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface SearchInputProps {
  value: string
  onChange: (query: string) => void
  placeholder?: string
  debounceMs?: number
}

export function SearchInput({ value, onChange, placeholder = 'Search...', debounceMs = 300 }: SearchInputProps) {
  const [input, setInput] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(input)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [input, onChange, debounceMs])

  useEffect(() => {
    setInput(value)
  }, [value])

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-10 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-primary transition"
      />
      {input && (
        <button
          onClick={() => setInput('')}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition"
          type="button"
        >
          <X size={20} />
        </button>
      )}
    </div>
  )
}
