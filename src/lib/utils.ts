/**
 * Cleans a Wikipedia category name for display as a UI label.
 * Strips location suffixes so labels stay concise (e.g. "Museums in Toronto" → "Museums").
 */
export function cleanCategoryName(name: string): string {
  if (!name) return ''
  return name
    .replace(/\s+in\s+.*$/, '')
    .replace(/\s+/g, ' ')
    .trim()
}
