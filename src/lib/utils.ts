/**
 * Cleans a Wikipedia category name by stripping redundant phrases, locations, and suffixes.
 * Useful for creating concise UI labels and for identifying redundant categories.
 */
export function cleanCategoryName(name: string): string {
  if (!name) return ''
  
  return name
    .replace(/\s+in\s+.*$/, '') // "Museums in Toronto" -> "Museums"
    .replace(/\s+buildings and structures$/, '')
    .replace(/\s+St\.\s+George$/, '')
    .replace(/\s+campuses$/, '')
    .replace(/\s+landmarks$/, '')
    .replace(/\s+affiliated with (the )?/, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}
