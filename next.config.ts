import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [{ key: 'Permissions-Policy', value: 'geolocation=(self)' }],
      },
    ]
  },
}

export default nextConfig
