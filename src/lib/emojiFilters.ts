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
    id: 'arts-culture',
    emoji: '🏛️',
    label: 'Arts & Culture',
    keywords: ['museum', 'gallery', 'heritage', 'historic', 'monument', 'memorial', 'landmark', 'theatre', 'theater', 'cinema', 'concert hall', 'opera', 'performing arts', 'art center', 'art centre'],
  },
  {
    id: 'nature',
    emoji: '🌳',
    label: 'Nature',
    keywords: ['park', 'garden', 'nature', 'forest', 'conservation', 'wildlife', 'mountain', 'river', 'lake', 'beach', 'island', 'valley', 'ravine', 'reservoir'],
  },
  {
    id: 'religion',
    emoji: '⛪',
    label: 'Religion',
    keywords: ['church', 'mosque', 'temple', 'synagogue', 'cathedral', 'chapel', 'shrine', 'religious', 'abbey', 'monastery', 'convent'],
  },
  {
    id: 'health',
    emoji: '🏥',
    label: 'Health',
    keywords: ['hospital', 'clinic', 'medical', 'health', 'healthcare'],
  },
  {
    id: 'sports',
    emoji: '🏟️',
    label: 'Sports',
    keywords: ['stadium', 'arena', 'sports', 'athletic', 'racecourse', 'golf course', 'velodrome'],
  },
  {
    id: 'neighborhoods',
    emoji: '🏘️',
    label: 'Neighborhoods',
    keywords: ['neighborhood', 'neighbourhood', 'district', 'borough', 'suburb', 'quarter', 'ward', 'community', 'township'],
  },
  {
    id: 'infrastructure',
    emoji: '🏗️',
    label: 'Infrastructure',
    keywords: ['bridge', 'tower', 'dam', 'tunnel', 'canal', 'lighthouse', 'skyscraper', 'power station', 'pipeline'],
  },
  {
    id: 'transport',
    emoji: '🚉',
    label: 'Transport',
    keywords: ['station', 'airport', 'port', 'metro', 'railway', 'harbor', 'harbour', 'bus terminal', 'transit'],
  },
  {
    id: 'government',
    emoji: '⚖️',
    label: 'Government',
    keywords: ['city hall', 'courthouse', 'embassy', 'parliament', 'government', 'administrative', 'municipal'],
  },
  {
    id: 'military',
    emoji: '⚔️',
    label: 'Military',
    keywords: ['fort', 'castle', 'fortress', 'battlefield', 'military', 'barracks', 'citadel', 'war memorial'],
  },
  {
    id: 'entertainment',
    emoji: '🎪',
    label: 'Entertainment',
    keywords: ['zoo', 'aquarium', 'theme park', 'amusement', 'fairground'],
  },
]

/** Returns true if any of the article's categories match the filter's keywords. */
export function articleMatchesFilter(categories: string[], filter: EmojiFilter): boolean {
  const lowerCats = categories.map((c) => c.toLowerCase())
  return filter.keywords.some((kw) => lowerCats.some((cat) => cat.includes(kw)))
}
