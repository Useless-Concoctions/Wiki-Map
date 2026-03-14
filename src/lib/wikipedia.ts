import { WikiGeoResult, WikiSummary } from '@/types'

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
  url.searchParams.set('gslimit', '50')
  url.searchParams.set('format', 'json')
  url.searchParams.set('origin', '*')

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`Wikipedia geosearch failed: ${res.status}`)
  const data = await res.json()
  return data.query?.geosearch ?? []
}

export async function fetchArticleSummary(title: string): Promise<WikiSummary> {
  const encoded = encodeURIComponent(title)
  const res = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encoded}`
  )
  if (!res.ok) throw new Error(`Wikipedia summary failed: ${res.status}`)
  return res.json()
}
