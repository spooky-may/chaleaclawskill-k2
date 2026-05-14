import { Link } from 'react-router-dom'
import { useChaleaBookmarks } from '../hooks/useChaleaBookmarks'
import { useChaleaSkills } from '../hooks/useChaleaSkills'
import { ChaleaSkillCard } from '../components/ChaleaSkillCard'
import { Bookmark, ArrowRight, Loader2 } from 'lucide-react'

export function BookmarksPage() {
  const { bookmarks, loading: bookmarksLoading } = useChaleaBookmarks()
  const { skills, loading: skillsLoading } = useChaleaSkills()

  const loading = bookmarksLoading || skillsLoading
  const bookmarkedSkills = skills.filter(skill => bookmarks.includes(skill.id))

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">

      <div className="flex items-center gap-3">
        <div className="p-3 bg-sky-50 rounded-[6px] border border-sky-100">
          <Bookmark className="w-6 h-6 text-sky-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[#09090b]">My Bookmarks</h1>
          <p className="text-[#71717a] text-sm mt-0.5">
            {bookmarkedSkills.length} saved skill{bookmarkedSkills.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {bookmarkedSkills.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {bookmarkedSkills.map(skill => (
            <ChaleaSkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 border border-dashed border-black/8 rounded-[6px] bg-white/60 text-center px-4">
          <div className="w-14 h-14 bg-sky-50 border border-sky-100 rounded-[6px] flex items-center justify-center mb-6">
            <Bookmark className="w-7 h-7 text-sky-400" />
          </div>
          <h2 className="text-lg font-semibold text-[#09090b] mb-2">No bookmarks yet</h2>
          <p className="text-[#71717a] max-w-md mb-8 text-sm">
            Save useful skills to your personal collection for quick access later.
          </p>
          <Link to="/browse">
            <button className="btn-primary">
              Browse Skills
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      )}
    </div>
  )
}
