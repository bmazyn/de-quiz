import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon-v2.png'],
      manifest: {
        name: 'QuickCard',
        short_name: 'QuickCard',
        description: 'QuickCard — Database Quiz App',
        start_url: '/',
        theme_color: '#667eea',
        background_color: '#1a1a1a',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-192-v2.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512-v2.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512-v2.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
})
