'use client'

import { useState, useEffect, useRef } from 'react'
import { Coords, Radius, WikiGeoResult } from '@/types'
import { fetchNearbyArticles } from '@/lib/wikipedia'

export function useWikiArticles(coords: Coords | null, radius: Radius) {
  const [articles, setArticles] = useState<WikiGeoResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const cacheRef = useRef<Map<string, WikiGeoResult[]>>(new Map())
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!coords) return

    const key = `${coords.lat.toFixed(4)}|${coords.lng.toFixed(4)}|${radius}`
    const cached = cacheRef.current.get(key)
    if (cached) {
      setArticles(cached)
      return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      setError(null)
      try {
        const results = await fetchNearbyArticles(coords.lat, coords.lng, radius)
        cacheRef.current.set(key, results)
        setArticles(results)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to fetch articles')
      } finally {
        setLoading(false)
      }
    }, 500)
  }, [coords, radius])

  return { articles, loading, error }
}
