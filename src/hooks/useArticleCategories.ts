'use client'

import { useState, useEffect, useRef } from 'react'
import { WikiGeoResult } from '@/types'
import { fetchCategoriesForPages } from '@/lib/wikipedia'
import { cleanCategoryName } from '@/lib/utils'

const MAX_CATEGORIES_SHOWN = 5

/** Wikipedia meta/maintenance categories we don't show as filters (not real "topics"). */
const META_CATEGORY_PREFIXES = [
  'Articles with ',
  'All articles with ',
  'All articles needing ',
  'All stub ',
  'Articles needing ',
  'Articles using ',
  'Pages using ',
  'Coordinates on ',
  'Short description ',
  'All Wikipedia ',
  'Wikipedia articles ',
  'Use ',
  'Use mdy ',
  'CS1 ',
  'CS1:',
  'Commons category ',
  'Infobox ',
  'Webarchive ',
  'Pages with ',
  'Redirects ',
  'Lists of ',
]

/** Substrings that indicate meta/maintenance categories (same kind of thing – not content topics). */
const META_CATEGORY_SUBSTRINGS = [
  'unsourced',
  'additional references',
  'needing references',
  'using infobox',
  'needing cleanup',
  'notability',
  'refimprove',
  'citation needed',
  'dead link',
  'orphan',
  'stub',
  'disambiguation',
  'coordinates',
  'portal',
  'template',
  'redirect',
  'maintenance',
  'wikify',
  'official website',
  'wikidata',
]

function isMetaCategory(name: string): boolean {
  const n = name.toLowerCase()
  if (META_CATEGORY_PREFIXES.some((p) => name.startsWith(p))) return true
  return META_CATEGORY_SUBSTRINGS.some((s) => n.includes(s))
}

export function useArticleCategories(articles: WikiGeoResult[]) {
  const [categoriesByPageId, setCategoriesByPageId] = useState<Map<number, string[]>>(new Map())
  const [loading, setLoading] = useState(false)
  const cacheRef = useRef<Map<string, Map<number, string[]>>>(new Map())

  useEffect(() => {
    if (articles.length === 0) {
      setCategoriesByPageId(new Map())
      return
    }

    const key = [...articles.map((a) => a.pageid)].sort((a, b) => a - b).join(',')
    const cached = cacheRef.current.get(key)
    if (cached) {
      setCategoriesByPageId(cached)
      return
    }

    let cancelled = false
    setLoading(true)
    fetchCategoriesForPages(articles.map((a) => a.pageid))
      .then((map) => {
        if (!cancelled) {
          cacheRef.current.set(key, map)
          setCategoriesByPageId(map)
        }
      })
      .catch(() => {
        if (!cancelled) setCategoriesByPageId(new Map())
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [articles])

  const categoryCounts = new Map<string, number>()
  categoriesByPageId.forEach((cats) => {
    cats.forEach((c) => {
      if (!isMetaCategory(c)) categoryCounts.set(c, (categoryCounts.get(c) ?? 0) + 1)
    })
  })
  const sortedEntries = [...categoryCounts.entries()].sort((a, b) => b[1] - a[1])
  const uniqueCategories: string[] = []
  const usedLabels = new Set<string>()

  for (const [name] of sortedEntries) {
    if (uniqueCategories.length >= MAX_CATEGORIES_SHOWN) break

    const label = cleanCategoryName(name)
    if (!label || usedLabels.has(label)) continue

    // Look for redundancy: if this category's label contains (or is contained by)
    // a label we've already selected, skip it to maintain variety.
    const isRedundant = Array.from(usedLabels).some((existingLabel) => {
      const l1 = label.toLowerCase()
      const l2 = existingLabel.toLowerCase()
      const shorter = l1.length < l2.length ? l1 : l2
      const longer = l1.length < l2.length ? l2 : l1
      return shorter.length > 3 && longer.includes(shorter)
    })

    if (!isRedundant) {
      uniqueCategories.push(name)
      usedLabels.add(label)
    }
  }

  return { categoriesByPageId, uniqueCategories, loading }
}
