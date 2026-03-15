'use client'

import { useState, useEffect, useRef } from 'react'
import { MapBounds, WikiGeoResult } from '@/types'
import { fetchArticlesInBounds } from '@/lib/wikipedia'

const DEBOUNCE_MS = 500
const CACHE_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours — skip re-fetch if data is fresh
const CACHE_MAX_ENTRIES = 50
const GRID_SIZE = 0.05 // degrees — snap viewport to this grid so nearby views share cache entries

interface CacheEntry {
  articles: WikiGeoResult[]
  cachedAt: number
}

/**
 * Snap a coordinate to the nearest grid line.
 * This means viewports that differ by a small pan hit the same cache key
 * instead of always being a miss.
 */
function snap(n: number): string {
  return (Math.round(n / GRID_SIZE) * GRID_SIZE).toFixed(2)
}

function boundsKey(b: MapBounds): string {
  return `wiki_cache_${snap(b.south)}|${snap(b.west)}|${snap(b.north)}|${snap(b.east)}`
}

function readCache(key: string): CacheEntry | null {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw) as CacheEntry
  } catch {
    return null
  }
}

function writeCache(key: string, articles: WikiGeoResult[]) {
  try {
    const entry: CacheEntry = { articles, cachedAt: Date.now() }
    localStorage.setItem(key, JSON.stringify(entry))

    // Evict oldest entries if we're over the limit
    const keys = Object.keys(localStorage).filter((k) => k.startsWith('wiki_cache_'))
    if (keys.length > CACHE_MAX_ENTRIES) {
      const withTime = keys
        .map((k) => {
          const e = readCache(k)
          return { key: k, cachedAt: e?.cachedAt ?? 0 }
        })
        .sort((a, b) => a.cachedAt - b.cachedAt)
      localStorage.removeItem(withTime[0].key)
    }
  } catch {
    // Storage full or unavailable — not critical
  }
}

export function useWikiArticles(bounds: MapBounds | null) {
  const [articles, setArticles] = useState<WikiGeoResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!bounds) return

    const key = boundsKey(bounds)
    const cached = readCache(key)

    // Always show cached data immediately so the map isn't blank
    if (cached) {
      setArticles(cached.articles)

      // If the cache is still fresh, skip the network fetch entirely
      if (Date.now() - cached.cachedAt < CACHE_TTL_MS) return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      setError(null)
      try {
        const results = await fetchArticlesInBounds(
          bounds.north,
          bounds.south,
          bounds.east,
          bounds.west
        )
        setArticles(results)
        writeCache(key, results)
      } catch (e) {
        console.error('Wiki fetch error:', e)
        setError(e instanceof Error ? e.message : 'Failed to fetch articles')
        // Keep existing articles on error
      } finally {
        setLoading(false)
      }
    }, DEBOUNCE_MS)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [bounds?.north, bounds?.south, bounds?.east, bounds?.west])

  return { articles, loading, error }
}
