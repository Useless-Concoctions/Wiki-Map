'use client'

import { useState, useEffect, useRef } from 'react'
import { MapBounds, WikiGeoResult } from '@/types'
import { fetchArticlesInBounds } from '@/lib/wikipedia'

const DEBOUNCE_MS = 300

function boundsKey(b: MapBounds): string {
  return `${b.south.toFixed(4)}|${b.west.toFixed(4)}|${b.north.toFixed(4)}|${b.east.toFixed(4)}`
}

export function useWikiArticles(bounds: MapBounds | null) {
  const [articles, setArticles] = useState<WikiGeoResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!bounds) return

    const key = `wiki_cache_${boundsKey(bounds)}`
    
    // Try to load from localStorage first
    try {
      const cached = localStorage.getItem(key)
      if (cached) {
        setArticles(JSON.parse(cached))
      }
    } catch (e) {
      console.warn('Failed to load from localStorage', e)
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
        
        // Cache to localStorage
        try {
          localStorage.setItem(key, JSON.stringify(results))
          
          // Cleanup old cache entries to prevent storage bloat
          const keys = Object.keys(localStorage).filter(k => k.startsWith('wiki_cache_'))
          if (keys.length > 50) {
            localStorage.removeItem(keys[0])
          }
        } catch (e) {
          console.warn('Failed to save to localStorage', e)
        }
      } catch (e) {
        console.error('Wiki fetch error:', e)
        setError(e instanceof Error ? e.message : 'Failed to fetch articles')
        // Don't wipe current articles on error, just keep what we have
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
