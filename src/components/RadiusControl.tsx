'use client'

import { Radius } from '@/types'

const OPTIONS: { label: string; value: Radius }[] = [
  { label: '500m', value: 500 },
  { label: '1km', value: 1000 },
  { label: '2km', value: 2000 },
]

interface Props {
  radius: Radius
  onChange: (r: Radius) => void
}

export default function RadiusControl({ radius, onChange }: Props) {
  return (
    <div className="fixed top-6 right-6 z-[1000] flex gap-1 glass p-1.5 rounded-2xl">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-4 py-2 rounded-[14px] text-sm font-bold tracking-wide transition-all duration-300 ${
            radius === opt.value
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.4)] scale-105'
              : 'text-gray-400 hover:text-white active:scale-95'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
