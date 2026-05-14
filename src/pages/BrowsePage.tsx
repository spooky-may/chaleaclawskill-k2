import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useChaleaSkills, useChaleaFilteredSkills } from '../hooks/useChaleaSkills'
import { useChaleaBundle } from '../hooks/useChaleaBundle'
import { useChaleaSemanticSearch } from '../hooks/useChaleaSemanticSearch'
import { ChaleaSkillCard } from '../components/ChaleaSkillCard'
import { ChaleaSearchBar } from '../components/ChaleaSearchBar'
import { ChaleaBundleBar } from '../components/ChaleaBundleBar'
import { CategoryFilter } from '../components/CategoryFilter'
import { Pagination } from '../components/Pagination'
import { SkeletonGrid } from '../components/Loading'
import { Package, SearchX, Sparkles, Loader2 } from 'lucide-react'

const ITEMS_PER_PAGE = 18

export function BrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { skills, categories, loading } = useChaleaSkills()
  const bundle = useChaleaBundle()

  const initialQuery    = searchParams.get('q') || ''
  const initialCategory = searchParams.get('category') || ''

  const [searchQuery, setSearchQuery]           = useState(initialQuery)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  )
  const [currentPage, setCurrentPage] = useState(1)
  const [filterKey, setFilterKey]     = useState(0)

  // Restore bundle from URL on mount
  useEffect(() => {
    const bundleParam = searchParams.get('bundle')
    if (bundleParam) {
      bundleParam.split(',').filter(Boolean).forEach(slug => {
        if (!bundle.isSelected(slug)) bundle.toggle(slug)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (selectedCategories.length === 1) params.set('category', selectedCategories[0])
    setSearchParams(params, { replace: true })
  }, [searchQuery, selectedCategories, setSearchParams])

  // Text-filtered candidates (always computed)
  const textFiltered = useChaleaFilteredSkills(skills, searchQuery, selectedCategories)

  // Semantic search hook — candidates are text-filtered so we narrow API payload
  const semantic = useChaleaSemanticSearch(textFiltered)

  // Trigger semantic search whenever query or candidates change
  useEffect(() => {
    if (semantic.enabled) semantic.search(searchQuery)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, textFiltered, semantic.enabled])

  // Active result set
  const activeSkills = (semantic.enabled && semantic.semanticResults)
    ? semantic.semanticResults
    : textFiltered

  useEffect(() => {
    setCurrentPage(1)
    setFilterKey(k => k + 1)
  }, [searchQuery, selectedCategories, semantic.semanticResults])

  const totalPages = Math.ceil(activeSkills.length / ITEMS_PER_PAGE)
  const paginatedSkills = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return activeSkills.slice(start, start + ITEMS_PER_PAGE)
  }, [activeSkills, currentPage])

  return (
    <div className="space-y-8 animate-fade-in">

      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-[#09090b] tracking-tight">Browse Skills</h1>
        <p className="text-[#71717a] text-base">
          Discover and install{' '}
          <span className="text-[#09090b] font-semibold">{skills.length.toLocaleString()}</span>{' '}
          AI agent skills
        </p>
      </div>

      {/* Search row */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <ChaleaSearchBar
            value={searchQuery}
            onChange={val => { setSearchQuery(val); if (!val) semantic.reset() }}
            placeholder={semantic.enabled ? 'Describe what you need...' : 'Search by name, description, or author...'}
          />
        </div>

        {/* Semantic toggle */}
        {semantic.hasKey && (
          <button
            onClick={semantic.toggle}
            title={semantic.enabled ? 'Disable semantic search' : 'Enable AI semantic search'}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-[4px] border text-sm font-semibold transition-all whitespace-nowrap ${
              semantic.enabled
                ? 'bg-sky-50 border-sky-300 text-sky-600 shadow-[0_0_0_3px_rgba(82,170,167,0.10)]'
                : 'bg-white border-black/8 text-[#71717a] hover:border-sky-300 hover:text-sky-600'
            }`}
          >
            {semantic.loading
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <Sparkles className="w-4 h-4" />
            }
            <span>Semantic</span>
          </button>
        )}

        <div className="md:hidden">
          <CategoryFilter
            categories={categories}
            selected={selectedCategories}
            onChange={setSelectedCategories}
          />
        </div>
      </div>

      {/* Semantic mode banner */}
      {semantic.enabled && (
        <div className={`flex items-center gap-3 px-4 py-2.5 rounded-[4px] border text-xs ${
          semantic.error
            ? 'bg-red-50 border-red-200 text-red-600'
            : 'bg-sky-50 border-sky-200 text-sky-700'
        }`}>
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          {semantic.error ? (
            <span>{semantic.error}</span>
          ) : semantic.loading ? (
            <span>Re-ranking results with Voyage AI…</span>
          ) : semantic.semanticResults ? (
            <span>
              Showing <strong>{semantic.semanticResults.length}</strong> semantically relevant results
              for <em>"{semantic.lastQuery}"</em> — powered by Voyage AI
            </span>
          ) : (
            <span>Semantic mode on — type a query to rank results by meaning, not just keywords</span>
          )}
        </div>
      )}

      <div className="flex gap-8 items-start">
        <div className="hidden md:block">
          <CategoryFilter
            categories={categories}
            selected={selectedCategories}
            onChange={setSelectedCategories}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2 text-[#71717a] text-sm">
              <Package className="w-4 h-4" />
              <span>
                {activeSkills.length.toLocaleString()} skill
                {activeSkills.length !== 1 ? 's' : ''} found
              </span>
            </div>
            {(searchQuery || selectedCategories.length > 0) && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategories([])
                  semantic.reset()
                }}
                className="text-sm text-sky-600 hover:underline font-medium"
              >
                Clear filters
              </button>
            )}
          </div>

          {loading ? (
            <SkeletonGrid count={9} />
          ) : activeSkills.length === 0 && !semantic.loading ? (
            <div className="text-center py-20 border border-dashed border-black/8 rounded-[6px] bg-white/60">
              <SearchX className="w-12 h-12 text-black/20 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-[#09090b]">No skills found</h3>
              <p className="text-[#71717a] mb-6 max-w-sm mx-auto text-sm">
                Try adjusting your search or clearing the filters.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategories([]); semantic.reset() }}
                className="btn-ghost text-xs py-2"
              >
                Clear all filters
              </button>
            </div>
          ) : semantic.loading ? (
            <SkeletonGrid count={9} />
          ) : (
            <>
              <div key={filterKey} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-10">
                {paginatedSkills.map((skill, i) => (
                  <div
                    key={skill.id}
                    className="animate-card-enter"
                    style={{ animationDelay: `${Math.min(i * 35, 350)}ms` }}
                  >
                    <ChaleaSkillCard
                      skill={skill}
                      bundleSelected={bundle.isSelected(skill.slug)}
                      onBundleToggle={bundle.toggle}
                    />
                  </div>
                ))}
              </div>
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </div>
      </div>

      <ChaleaBundleBar
        selected={bundle.selected}
        skills={skills}
        buildCommand={bundle.buildCommand}
        shareUrl={bundle.shareUrl}
        onClear={bundle.clear}
        onRemove={bundle.toggle}
      />
    </div>
  )
}
