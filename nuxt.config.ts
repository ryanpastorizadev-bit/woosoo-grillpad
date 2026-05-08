import process from 'node:process'
import tailwindcss from '@tailwindcss/vite'

const appVersion
  = process.env.NUXT_PUBLIC_APP_VERSION
    || new Date()
      .toISOString()
      .replace(/[-:.TZ]/g, '')
      .slice(0, 12)

export default defineNuxtConfig({
  compatibilityDate: '2026-05-08',
  devtools: { enabled: process.env.NODE_ENV !== 'production' },
  ssr: false,
  experimental: {
    viteEnvironmentApi: true,
  },
  modules: ['@pinia/nuxt', '@vite-pwa/nuxt', '@nuxtjs/color-mode'],
  css: ['~/assets/css/tailwind.css'],
  postcss: {
    plugins: {
      autoprefixer: {},
    },
  },
  app: {
    head: {
      title: 'GrillPad',
      htmlAttrs: { lang: 'en' },
      meta: [
        {
          name: 'viewport',
          content:
            'width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no',
        },
        { name: 'theme-color', content: '#0f0b08' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        {
          name: 'apple-mobile-web-app-status-bar-style',
          content: 'black-translucent',
        },
      ],
      link: [{ rel: 'icon', href: '/favicon.svg' }],
    },
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api',
      appVersion,
      reverb: {
        key: process.env.NUXT_PUBLIC_REVERB_KEY || '',
        host: process.env.NUXT_PUBLIC_REVERB_HOST || '127.0.0.1',
        port: Number(process.env.NUXT_PUBLIC_REVERB_PORT || 8080),
        scheme: process.env.NUXT_PUBLIC_REVERB_SCHEME || 'ws',
      },
    },
  },
  routeRules: {
    '/**': {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    },
    '/_nuxt/**': {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    },
    '/sw.js': {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    },
    '/workbox-*.js': {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    },
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      manifest: true,
      sourcemap: false,
      rollupOptions: {
        output: {
          entryFileNames: 'assets/[name].[hash].js',
          chunkFileNames: 'assets/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash][extname]',
        },
      },
    },
  },
  pwa: {
    registerType: 'prompt',
    injectRegister: 'auto',
    manifest: {
      name: 'Woosoo GrillPad',
      short_name: 'GrillPad',
      description: 'Tablet ordering PWA for Woosoo dine-in sessions',
      theme_color: '#0f0b08',
      background_color: '#0a0707',
      display: 'fullscreen',
      orientation: 'landscape',
      start_url: '/start',
      scope: '/',
      icons: [
        { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
    },
    workbox: {
      cleanupOutdatedCaches: true,
      clientsClaim: true,
      skipWaiting: false,
      navigateFallback: '/start',
      globPatterns: ['**/*.{js,css,html,png,svg,ico,webp,woff2}'],
      runtimeCaching: [
        {
          // Offline-first for page navigations
          urlPattern:
            /^https?:\/\/[^/]+\/(?:$|start(?:[/?#].*)?$|package(?:[/?#].*)?$|session(?:\/ended)?(?:[/?#].*)?$|order\/(?:initial|review|refill)(?:[/?#].*)?$)/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'grillpad-pages',
            networkTimeoutSeconds: 3,
          },
        },
        {
          // API - never cache (covers both proxied and direct backend calls)
          urlPattern: /^https?:\/\/[^/]+\/api\/.*$/,
          handler: 'NetworkOnly',
          options: {
            cacheName: 'grillpad-api-never-truth',
          },
        },
        {
          urlPattern:
            /^https?:\/\/[^/]+\/.*\.(?:js|css|png|svg|ico|webp|woff2?)(?:[?#].*)?$/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'grillpad-static-assets',
          },
        },
      ],
    },
    devOptions: { enabled: false },
  },
  colorMode: {
    preference: 'dark',
    fallback: 'dark',
    classSuffix: '',
  },
  typescript: {
    strict: true,
    typeCheck: true,
  },
})
