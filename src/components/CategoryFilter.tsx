import { X, Filter } from 'lucide-react'
import type { Category } from '../lib/types'
import { useState } from 'react'

interface CategoryFilterProps {
  categories: Category[]
  selected: string[]
  onChange: (categories: string[]) => void
}

export function CategoryFilter({ categories, selected, onChange }: CategoryFilterProps) {
  const [showMobile, setShowMobile] = useState(false)

  const toggleCategory = (categoryName: string) => {
    if (selected.includes(categoryName)) {
      onChange(selected.filter(c => c !== categoryName))
    } else {
      onChange([...selected, categoryName])
    }
  }

  const clearAll = () => onChange([])
  const sortedCategories = [...categories].sort((a, b) => b.count - a.count)

  return (
    <>
      {/* Mobile trigger */}
      <button
        onClick={() => setShowMobile(true)}
        className="md:hidden flex items-center gap-2 px-4 py-2 bg-white border border-black/8 rounded-[4px] text-sm font-medium text-[#09090b] hover:bg-black/4 transition-colors"
      >
        <Filter className="w-4 h-4 text-[#71717a]" />
        Filter
        {selected.length > 0 && (
          <span className="ml-1 px-2 py-0.5 bg-sky-500 text-white text-xs font-bold rounded-[2px]">
            {selected.length}
          </span>
        )}
      </button>

      {/* Desktop sidebar */}
      <div className="hidden md:block w-56 flex-shrink-0">
        <div className="sticky top-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold text-[#09090b] uppercase tracking-[0.15em]">Categories</h3>
            {selected.length > 0 && (
              <button onClick={clearAll} className="text-xs text-sky-600 hover:underline">
                Clear
              </button>
            )}
          </div>
          <div className="space-y-0.5 max-h-[calc(100vh-200px)] overflow-y-auto pr-1">
            {sortedCategories.map(category => {
              const active = selected.includes(category.name)
              return (
                <button
                  key={category.slug}
                  onClick={() => toggleCategory(category.name)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-[4px] text-sm transition-all text-left ${
                    active
                      ? 'bg-sky-50 text-sky-700 border border-sky-200'
                      : 'text-[#71717a] border border-transparent hover:bg-black/4 hover:text-[#09090b]'
                  }`}
                >
                  <span className="truncate">{category.name}</span>
                  <span className={`text-[11px] ml-2 px-1.5 py-0.5 rounded-[2px] shrink-0 ${
                    active ? 'bg-sky-100 text-sky-600' : 'bg-[#f1f5f9] text-[#71717a]'
                  }`}>
                    {category.count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Mobile modal */}
      {showMobile && (
        <div className="md:hidden fixed inset-0 z-[60] bg-black/30 backdrop-blur-[2px] animate-fade-in">
          <div className="absolute inset-x-0 bottom-0 bg-[#f8fafc] border-t border-black/8 rounded-t-[8px] max-h-[80vh]">
            <div className="sticky top-0 bg-white p-4 border-b border-black/6 flex items-center justify-between rounded-t-[8px]">
              <h3 className="font-semibold text-[#09090b] text-sm">Filter by Category</h3>
              <button onClick={() => setShowMobile(false)} className="p-1.5 text-[#71717a] hover:text-[#09090b]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(80vh-120px)]">
              {selected.length > 0 && (
                <button onClick={clearAll} className="mb-4 text-sm text-sky-600 hover:underline">
                  Clear all ({selected.length} selected)
                </button>
              )}
              <div className="space-y-1">
                {sortedCategories.map(category => {
                  const active = selected.includes(category.name)
                  return (
                    <button
                      key={category.slug}
                      onClick={() => toggleCategory(category.name)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-[4px] text-sm transition-colors border ${
                        active
                          ? 'bg-sky-50 text-sky-700 border-sky-200'
                          : 'bg-white text-[#71717a] border-black/6 hover:bg-black/4 hover:text-[#09090b]'
                      }`}
                    >
                      <span>{category.name}</span>
                      <span className={`text-xs ${active ? 'text-sky-600' : 'text-[#71717a]'}`}>
                        {category.count}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="sticky bottom-0 bg-white p-4 border-t border-black/6">
              <button
                onClick={() => setShowMobile(false)}
                className="btn-primary w-full justify-center py-3"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
