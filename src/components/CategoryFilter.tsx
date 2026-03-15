'use client'

import { EMOJI_FILTERS, EmojiFilter } from '@/lib/emojiFilters'

interface Props {
  selected: string | null
  onChange: (filterId: string | null) => void
}

export default function CategoryFilter({ selected, onChange }: Props) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
      {EMOJI_FILTERS.map((filter: EmojiFilter) => {
        const isSelected = selected === filter.id
        return (
          <button
            key={filter.id}
            type="button"
            onClick={() => onChange(isSelected ? null : filter.id)}
            title={filter.label}
            className={`shrink-0 h-10 px-3.5 flex items-center gap-1.5 rounded-full text-sm font-semibold transition-all border shadow-md whitespace-nowrap pointer-events-auto ${
              isSelected
                ? 'bg-blue-600 text-white border-blue-600 shadow-blue-200'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <span className="text-base leading-none">{filter.emoji}</span>
            <span className="text-xs">{filter.label}</span>
          </button>
        )
      })}
    </div>
  )
}
