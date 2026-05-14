import { Search, X } from 'lucide-react'

interface ChaleaSearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  large?: boolean
}

export function ChaleaSearchBar({
  value,
  onChange,
  placeholder = 'Search skills...',
  large = false,
}: ChaleaSearchBarProps) {
  return (
    <div className="relative w-full group">
      <Search
        className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717a] group-focus-within:text-sky-500 transition-colors ${
          large ? 'w-5 h-5' : 'w-4 h-4'
        }`}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-white border border-black/8 rounded-[4px] text-[#09090b] placeholder:text-[#71717a] outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all font-mono ${
          large ? 'h-14 pl-12 pr-12 text-base' : 'h-11 pl-10 pr-9 text-sm'
        }`}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className={`absolute right-3 top-1/2 -translate-y-1/2 text-[#71717a] hover:text-[#09090b] transition-colors`}
        >
          <X className={large ? 'w-5 h-5' : 'w-4 h-4'} />
        </button>
      )}
    </div>
  )
}
