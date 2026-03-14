'use client'
import { cleanCategoryName } from '@/lib/utils'

interface Props {
  categories: string[]
  selected: string | null
  onChange: (category: string | null) => void
  loading?: boolean
}

/** Optional shortening: strip redundant phrases and suffixes. */
function displayLabel(name: string): string {
  return cleanCategoryName(name) || name
}

export default function CategoryFilter({ categories, selected, onChange, loading }: Props) {
  if (categories.length === 0 && !loading) return null

  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth pointer-events-none">
      {categories.map((cat) => {
        const isSelected = selected === cat
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onChange(isSelected ? null : cat)}
            disabled={loading}
            className={`shrink-0 px-4 h-10 flex items-center rounded-full text-xs font-bold transition-all border whitespace-nowrap pointer-events-auto ${
              isSelected
                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 shadow-md'
            } ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
            title={cat}
          >
            {displayLabel(cat)}
          </button>
        )
      })}
    </div>
  )
}
