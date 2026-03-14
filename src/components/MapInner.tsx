'use client'

import { useEffect, useState, useMemo } from 'react'
import L from 'leaflet'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

import { Coords, Radius, WikiGeoResult } from '@/types'
import { useGeolocation } from '@/hooks/useGeolocation'
import { useWikiArticles } from '@/hooks/useWikiArticles'
import ArticlePanel from './ArticlePanel'
import RadiusControl from './RadiusControl'

// Custom article marker icon (Modern SVG)
const createWikiIcon = (isSelected: boolean) => new L.DivIcon({
  html: `
    <div class="relative group cursor-pointer transition-all duration-300 ${isSelected ? 'scale-125 z-[2000]' : 'hover:scale-110'}">
      <div class="w-8 h-8 rounded-full shadow-lg border-2 ${isSelected ? 'border-purple-500 bg-purple-900/80 shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'border-gray-600 bg-gray-900/80 backdrop-blur-md'} flex items-center justify-center overflow-hidden">
        <span class="text-sm font-bold ${isSelected ? 'text-white' : 'text-gray-300'}">W</span>
      </div>
      <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 border-r border-b ${isSelected ? 'border-purple-500 bg-purple-900 shadow-[0_0_10px_rgba(168,85,247,0.5)]' : 'border-gray-600 bg-gray-900'}"></div>
    </div>
  `,
  className: '',
  iconSize: [32, 36],
  iconAnchor: [16, 36],
})

// Current location icon
const youIcon = new L.DivIcon({
  html: `
    <div class="relative">
      <div class="absolute inset-0 w-4 h-4 bg-cyan-400 rounded-full animate-ping opacity-40 shadow-[0_0_20px_rgba(34,211,238,0.8)]"></div>
      <div class="relative w-4 h-4 bg-cyan-500 border-2 border-white rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
    </div>
  `,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
  className: '',
})

function RecenterMap({ coords }: { coords: Coords }) {
  const map = useMap()
  useEffect(() => {
    map.flyTo([coords.lat, coords.lng], map.getZoom(), { animate: true, duration: 1.5 })
  }, [coords, map])
  return null
}

function ArticleCountBadge({ count, loading }: { count: number; loading: boolean }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:left-6 md:translate-x-0 z-[1000] glass px-5 py-2.5 rounded-2xl flex items-center gap-3">
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
          <span className="text-sm font-medium text-gray-300 tracking-wide">Discovering...</span>
        </div>
      ) : (
        <>
          <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"></span>
          <span className="text-sm font-semibold text-gray-200 tracking-wide">{count} places found</span>
        </>
      )}
    </div>
  )
}

function MapController({ coords }: { coords: Coords | null }) {
  const map = useMap()
  
  return (
    <div className="absolute top-24 left-6 z-[1000] flex flex-col gap-3">
      <button
        onClick={() => coords && map.flyTo([coords.lat, coords.lng], 15, { animate: true, duration: 1.5 })}
        className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:scale-105 active:scale-95 transition-all pointer-events-auto"
        title="My Location"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 11 22 2 13 21 11 13 3 11" />
        </svg>
      </button>
    </div>
  )
}

export default function MapInner() {
  const { coords, error: geoError, loading: geoLoading } = useGeolocation()
  const [radius, setRadius] = useState<Radius>(1000)
  const { articles, loading: wikiLoading } = useWikiArticles(coords, radius)
  const [selectedArticle, setSelectedArticle] = useState<WikiGeoResult | null>(null)

  const defaultCenter: [number, number] = [43.6532, -79.3832]

  if (geoLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-dvh bg-transparent p-6 relative z-[2000]">
        <div className="relative mb-8">
          <div className="w-16 h-16 border-4 border-gray-800 rounded-full" />
          <div className="absolute top-0 w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(168,85,247,0.3)]" />
          <div className="absolute inset-0 flex items-center justify-center font-bold text-white text-xl">W</div>
        </div>
        <p className="text-gray-200 font-semibold text-xl tracking-wide">Locating you</p>
        <p className="text-gray-500 text-sm mt-2">Finding nearby information...</p>
      </div>
    )
  }

  if (geoError && !coords) {
    return (
      <div className="flex items-center justify-center h-dvh bg-transparent p-8 relative z-[2000]">
        <div className="text-center space-y-5 max-w-sm glass p-8 rounded-3xl">
          <div className="text-5xl drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">📍</div>
          <h2 className="text-2xl font-bold text-white tracking-wide">Signal Lost</h2>
          <p className="text-gray-400 leading-relaxed">Wiki Map needs your location coordinates to scan the area.</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3.5 rounded-xl hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(147,51,234,0.4)] mt-4"
          >
            Recalibrate
          </button>
        </div>
      </div>
    )
  }

  const center: [number, number] = coords ? [coords.lat, coords.lng] : defaultCenter

  return (
    <div className="relative w-full h-dvh overflow-hidden select-none">
      <MapContainer
        center={center}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        {coords && <RecenterMap coords={coords} />}
        {coords && (
          <Marker position={[coords.lat, coords.lng]} icon={youIcon} zIndexOffset={1000} />
        )}
        {articles.map((a) => (
          <Marker
            key={a.pageid}
            position={[a.lat, a.lon]}
            icon={createWikiIcon(selectedArticle?.pageid === a.pageid)}
            eventHandlers={{
              click: () => {
                setSelectedArticle(a)
              }
            }}
          />
        ))}

        <MapController coords={coords} />
      </MapContainer>

      <div className="absolute top-6 left-6 z-[1000] pointer-events-none">
        <h1 className="text-2xl font-black tracking-widest glass px-5 py-2 rounded-2xl pointer-events-auto text-white">
          WIKI<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 ml-1">MAP</span>
        </h1>
      </div>

      <RadiusControl radius={radius} onChange={setRadius} />
      <ArticleCountBadge count={articles.length} loading={wikiLoading} />
      
      <ArticlePanel
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />
    </div>
  )
}
