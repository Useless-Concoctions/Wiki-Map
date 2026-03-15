'use client'

import { useEffect, useState } from 'react'
import { WikiGeoResult, WikiSummary } from '@/types'
import { fetchArticleSummary } from '@/lib/wikipedia'

interface Props {
  article: WikiGeoResult | null
  onClose: () => void
}

export default function ArticlePanel({ article, onClose }: Props) {
  const [summary, setSummary] = useState<WikiSummary | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!article) {
      setSummary(null)
      return
    }
    console.log('ArticlePanel received article:', article.title)
    setLoading(true)
    setError(null)
    setSummary(null)
    fetchArticleSummary(article.title)
      .then((data) => {
        console.log('Article summary loaded:', data.title)
        setSummary(data)
      })
      .catch((e) => {
        console.error('Article summary fetch error:', e)
        setError(e.message)
      })
      .finally(() => setLoading(false))
  }, [article])

  const isOpen = !!article

  return (
    <div
      className={`fixed left-6 top-20 z-[1002] w-[312px] max-h-[calc(100dvh-120px)] bg-white shadow-2xl transition-all duration-300 ease-out transform rounded-3xl overflow-hidden border border-slate-200 flex flex-col ${
        isOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95 pointer-events-none'
      }`}
    >
      {/* Header Image or Placeholder */}
      <div className="relative h-56 bg-slate-100 shrink-0">
        {summary?.thumbnail ? (
          <img
            src={summary.thumbnail.source}
            alt={article?.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 shadow-md text-slate-700 hover:bg-white transition-colors"
          aria-label="Close"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 leading-tight">
            {article?.title}
          </h2>
        </div>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-slate-100 rounded w-full" />
            <div className="h-4 bg-slate-100 rounded w-5/6" />
            <div className="h-4 bg-slate-100 rounded w-4/6" />
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
            Could not load full preview from Wikipedia.
          </div>
        ) : (
          summary && (
            <>
              <div className="prose prose-slate prose-sm max-w-none">
                <p className="text-slate-600 leading-relaxed text-[15px]">
                  {summary.extract}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <a
                  href={summary.content_urls.desktop.page}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-full hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  Read full article
                </a>
              </div>
            </>
          )
        )}
      </div>
    </div>
  )
}
