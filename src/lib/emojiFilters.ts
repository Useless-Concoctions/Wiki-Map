export interface EmojiFilter {
  id: string
  emoji: string
  label: string
  /** Keywords matched against an article's Wikipedia category names (case-insensitive). */
  keywords: string[]
}

export const EMOJI_FILTERS: EmojiFilter[] = [
  {
    id: 'education',
    emoji: '🎓',
    label: 'Education',
    keywords: ['university', 'college', 'school', 'education', 'academic', 'institute', 'faculty', 'library'],
  },
  {
    id: 'culture',
    emoji: '🏛️',
    label: 'Culture',
    keywords: ['museum', 'gallery', 'heritage', 'historic', 'monument', 'memorial', 'landmark'],
  },
  {
    id: 'nature',
    emoji: '🌳',
    label: 'Nature',
    keywords: ['park', 'garden', 'nature', 'forest', 'conservation', 'wildlife', 'ravine'],
  },
  {
    id: 'religion',
    emoji: '⛪',
    label: 'Religion',
    keywords: ['church', 'mosque', 'temple', 'synagogue', 'cathedral', 'chapel', 'shrine', 'religious'],
  },
  {
    id: 'health',
    emoji: '🏥',
    label: 'Health',
    keywords: ['hospital', 'clinic', 'medical', 'health', 'healthcare'],
  },
  {
    id: 'arts',
    emoji: '🎭',
    label: 'Arts',
    keywords: ['theatre', 'theater', 'cinema', 'concert hall', 'opera', 'performing arts'],
  },
  {
    id: 'sports',
    emoji: '🏟️',
    label: 'Sports',
    keywords: ['stadium', 'arena', 'sports', 'athletic'],
  },
]

/** Returns true if any of the article's categories match the filter's keywords. */
export function articleMatchesFilter(categories: string[], filter: EmojiFilter): boolean {
  const lowerCats = categories.map((c) => c.toLowerCase())
  return filter.keywords.some((kw) => lowerCats.some((cat) => cat.includes(kw)))
}
