import { WikiGeoResult, WikiSummary } from '@/types'

const WIKI_HEADERS: HeadersInit = {
  'User-Agent': 'WikiMap/1.0 (https://github.com; educational map app)',
}

export async function fetchNearbyArticles(
  lat: number,
  lng: number,
  radiusMeters: number
): Promise<WikiGeoResult[]> {
  const url = new URL('https://en.wikipedia.org/w/api.php')
  url.searchParams.set('action', 'query')
  url.searchParams.set('list', 'geosearch')
  url.searchParams.set('gscoord', `${lat}|${lng}`)
  url.searchParams.set('gsradius', String(radiusMeters))
  url.searchParams.set('gslimit', '150')
  url.searchParams.set('format', 'json')
  url.searchParams.set('origin', '*')

  const res = await fetch(url.toString(), { headers: WIKI_HEADERS })
  if (!res.ok) throw new Error(`Wikipedia geosearch failed: ${res.status}`)
  const data = await res.json()
  return data.query?.geosearch ?? []
}

/** Fetch articles inside the visible map bounds (topLat|leftLon|bottomLat|rightLon = north|west|south|east). */
export async function fetchArticlesInBounds(
  north: number,
  south: number,
  east: number,
  west: number
): Promise<WikiGeoResult[]> {
  const url = new URL('https://en.wikipedia.org/w/api.php')
  url.searchParams.set('action', 'query')
  url.searchParams.set('list', 'geosearch')
  url.searchParams.set('gsbbox', `${north}|${west}|${south}|${east}`)
  url.searchParams.set('gslimit', '150')
  url.searchParams.set('format', 'json')
  url.searchParams.set('origin', '*')

  const res = await fetch(url.toString(), { headers: WIKI_HEADERS })
  if (!res.ok) throw new Error(`Wikipedia geosearch failed: ${res.status}`)
  const data = await res.json()
  
  if (data.error?.code === 'toobig') {
    // Bounds are too large for Wikipedia's API — fall back to a radius search.
    // Use 50km so the search covers the full visible area even if the center is over water.
    const centerLat = (north + south) / 2
    const centerLng = (east + west) / 2
    return fetchNearbyArticles(centerLat, centerLng, 50000)
  }
  
  return data.query?.geosearch ?? []
}

export async function fetchArticleSummary(title: string): Promise<WikiSummary> {
  const encoded = encodeURIComponent(title)
  const res = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encoded}`,
    { headers: WIKI_HEADERS }
  )
  if (!res.ok) throw new Error(`Wikipedia summary failed: ${res.status}`)
  return res.json()
}

const CATEGORY_PREFIX = 'Category:'

/** Fetch categories for multiple pages (based on current Wikipedia articles). Max 50 page IDs per request. */
export async function searchArticles(query: string): Promise<WikiGeoResult[]> {
  const url = new URL('https://en.wikipedia.org/w/api.php')
  url.searchParams.set('action', 'query')
  url.searchParams.set('list', 'search')
  url.searchParams.set('srsearch', query)
  url.searchParams.set('format', 'json')
  url.searchParams.set('origin', '*')

  const res = await fetch(url.toString(), { headers: WIKI_HEADERS })
  if (!res.ok) throw new Error(`Wikipedia search failed: ${res.status}`)
  const data = await res.json()
  const searchResults = data.query?.search ?? []

  if (searchResults.length === 0) return []

  // Get coordinates for these articles
  const titles = searchResults.map((s: any) => s.title).join('|')
  const coordUrl = new URL('https://en.wikipedia.org/w/api.php')
  coordUrl.searchParams.set('action', 'query')
  coordUrl.searchParams.set('prop', 'coordinates')
  coordUrl.searchParams.set('titles', titles)
  coordUrl.searchParams.set('format', 'json')
  coordUrl.searchParams.set('origin', '*')

  const coordRes = await fetch(coordUrl.toString(), { headers: WIKI_HEADERS })
  const coordData = await coordRes.json()
  const pages = coordData.query?.pages ?? {}
  
  return Object.values(pages)
    .filter((p: any) => p.coordinates)
    .map((p: any) => ({
      pageid: p.pageid,
      title: p.title,
      lat: p.coordinates[0].lat,
      lon: p.coordinates[0].lon,
      dist: 0 // Distance will be calculated by the UI relative to center
    }))
}

export async function fetchCategoriesForPages(
  pageIds: number[]
): Promise<{ categories: Map<number, string[]>; lengths: Map<number, number> }> {
  if (pageIds.length === 0) return { categories: new Map(), lengths: new Map() }
  const limit = 50
  const categories = new Map<number, string[]>()
  const lengths = new Map<number, number>()
  for (let i = 0; i < pageIds.length; i += limit) {
    const batch = pageIds.slice(i, i + limit)
    const url = new URL('https://en.wikipedia.org/w/api.php')
    url.searchParams.set('action', 'query')
    url.searchParams.set('prop', 'categories|info')
    url.searchParams.set('pageids', batch.join('|'))
    url.searchParams.set('cllimit', '500')
    url.searchParams.set('format', 'json')
    url.searchParams.set('origin', '*')
    const res = await fetch(url.toString(), { headers: WIKI_HEADERS })
    if (!res.ok) throw new Error(`Wikipedia categories failed: ${res.status}`)
    const data = await res.json()
    const pages = data.query?.pages ?? {}
    for (const pageId of batch) {
      const page = pages[String(pageId)]
      const cats = Array.isArray(page?.categories) ? page.categories : []
      categories.set(
        pageId,
        cats.map((c: { title: string }) =>
          c.title.startsWith(CATEGORY_PREFIX)
            ? c.title.slice(CATEGORY_PREFIX.length)
            : c.title
        )
      )
      if (typeof page?.length === 'number') lengths.set(pageId, page.length)
    }
  }
  return { categories, lengths }
}
