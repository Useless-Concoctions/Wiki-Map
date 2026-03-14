'use client'

import dynamic from 'next/dynamic'

const MapInner = dynamic(() => import('./MapInner'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center h-dvh bg-[var(--bg)]">
      <div className="w-10 h-10 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
      <p className="mt-4 text-sm text-gray-500">Loading map…</p>
    </div>
  ),
})

export default function MapView() {
  return <MapInner />
}
