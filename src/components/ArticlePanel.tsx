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
    setLoading(true)
    setError(null)
    setSummary(null)
    fetchArticleSummary(article.title)
      .then(setSummary)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [article])

  const isOpen = !!article

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[1000] bg-[#030014]/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed bottom-0 left-0 right-0 z-[1001] glass rounded-t-[32px] transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1) max-h-[85dvh] overflow-hidden flex flex-col border-t border-white/10 ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Drag Handle */}
        <div 
          className="w-full flex justify-center py-4 cursor-grab active:cursor-grabbing"
          onClick={onClose}
        >
          <div className="w-12 h-1.5 bg-gray-600 rounded-full" />
        </div>

        <div className="flex items-center justify-between px-6 pb-4">
          <h2 className="text-2xl font-bold tracking-wide truncate pr-4 text-white">
            {article?.title ?? 'Explore'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white transition-all"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-8 no-scrollbar">
          {loading && (
            <div className="space-y-4 animate-pulse">
              <div className="aspect-video bg-gray-800/50 rounded-2xl" />
              <div className="h-6 bg-gray-800/50 rounded-lg w-3/4" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-800/50 rounded-md" />
                <div className="h-4 bg-gray-800/50 rounded-md" />
                <div className="h-4 bg-gray-800/50 rounded-md w-5/6" />
              </div>
            </div>
          )}

          {error && (
            <div className="py-10 text-center">
              <div className="text-4xl mb-3 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">😕</div>
              <p className="text-gray-400 font-medium tracking-wide">Could not load preview.</p>
            </div>
          )}

          {summary && !loading && (
            <div className="space-y-6">
              {summary.thumbnail && (
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-sm">
                  <img
                    src={summary.thumbnail.source}
                    alt={summary.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="space-y-4">
                <p className="text-gray-300 text-lg leading-relaxed font-light">
                  {summary.extract}
                </p>
                
                <div className="pt-4">
                  <a
                    href={summary.content_urls.mobile.page}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg font-semibold py-4 rounded-2xl hover:brightness-110 transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(147,51,234,0.3)] mt-2"
                  >
                    Read on Wikipedia
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
