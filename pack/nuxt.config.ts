// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2025-12-29',
  ssr: true,
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@nuxtjs/sitemap',
    'nuxt-schema-org',
    '@nuxtjs/robots'
  ],

  // Server-side storage for Token Management & Settings
  // Uses Vercel KV in production (if configured), FS locally
  nitro: {
    storage: {
      data: {
        driver: process.env.KV_REST_API_URL ? 'vercelKV' : 'fs',
        base: process.env.KV_REST_API_URL ? 'site-settings:' : './.data/kv'
      }
    }
  },

  // Site URL for sitemap and schema
  site: {
    url: process.env.SITE_URL || 'https://example.com',
    name: process.env.SITE_NAME || 'Portfolio'
  },

  // Sitemap configuration
  sitemap: {
    sources: ['/api/__sitemap__/urls']
  },

  // Schema.org configuration for GEO (Generative Engine Optimization)
  schemaOrg: {
    identity: {
      type: 'LocalBusiness',
      name: process.env.SITE_NAME || 'Portfolio',
      logo: '/logo.png',
      image: '/logo.png',
      url: process.env.SITE_URL || 'https://example.com',
      telephone: process.env.BUSINESS_PHONE || '',
      address: {
        streetAddress: process.env.BUSINESS_ADDRESS || '',
        addressLocality: process.env.BUSINESS_CITY || '',
        addressRegion: process.env.BUSINESS_REGION || '',
        postalCode: process.env.BUSINESS_ZIP || '',
        addressCountry: 'TR'
      },
      geo: {
        latitude: parseFloat(process.env.BUSINESS_LAT || '0'),
        longitude: parseFloat(process.env.BUSINESS_LNG || '0')
      },
      sameAs: [
        process.env.SOCIAL_INSTAGRAM || '',
        process.env.SOCIAL_FACEBOOK || ''
      ],
      priceRange: '₺₺'
    }
  },

  // Image optimization
  image: {
    quality: 80,
    format: ['webp', 'jpg'],
    domains: [
      'scontent.cdninstagram.com',
      'scontent-ist1-1.cdninstagram.com',
      'instagram.fist1-1.fna.fbcdn.net',
      'video.cdninstagram.com'
    ],
    alias: {
      instagram: 'https://scontent.cdninstagram.com'
    }
  },

  runtimeConfig: {
    // Private keys (Server-side only)
    instagramAccessToken: process.env.NUXT_INSTAGRAM_ACCESS_TOKEN || process.env.ACCESS_TOKEN,
    instagramBusinessId: process.env.NUXT_INSTAGRAM_BUSINESS_ID || process.env.INSTAGRAM_BUSINESS_ID,
    adminPassword: process.env.ADMIN_PASSWORD || 'admin123',
    // Public keys (Client-side)
    public: {
      siteUrl: process.env.SITE_URL || 'https://example.com',
      gtmId: process.env.GTM_ID || '',
      businessType: process.env.BUSINESS_TYPE || 'PRODUCT',
      businessName: process.env.BUSINESS_NAME || 'Portfolio',
      businessProfession: process.env.BUSINESS_PROFESSION || 'Portfolio',
      businessPhone: process.env.BUSINESS_PHONE || '',
      businessAddress: process.env.BUSINESS_ADDRESS || '',
      businessCity: process.env.BUSINESS_CITY || '',
      businessLatitude: parseFloat(process.env.BUSINESS_LAT || '0'),
      businessLongitude: parseFloat(process.env.BUSINESS_LNG || '0'),
      instagramUrl: process.env.SOCIAL_INSTAGRAM || '',
      facebookUrl: process.env.SOCIAL_FACEBOOK || ''
    }
  },

  app: {
    head: {
      title: 'Portfolio - Instagram Showcase',
      htmlAttrs: {
        lang: 'tr'
      },
      meta: [
        { name: 'description', content: process.env.SITE_DESCRIPTION || 'Portfolio' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:locale', content: 'tr_TR' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: process.env.SITE_NAME || 'Portfolio' },
        { name: 'apple-mobile-web-app-title', content: process.env.SITE_NAME || 'Portfolio' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/svg+xml', href: '/icon.svg' },
        { rel: 'icon', type: 'image/png', href: '/icon.png' },
        { rel: 'apple-touch-icon', href: '/apple-icon.png' },
        { rel: 'manifest', href: '/manifest.json' }
      ]
    }
  }
})
