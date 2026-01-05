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

  // Server-side storage for Token Management (No-DB solution)
  nitro: {
    storage: {
      data: {
        driver: 'fs',
        base: './.data/kv'
      }
    }
  },

  // Site URL for sitemap and schema
  site: {
    url: process.env.SITE_URL || 'https://bumudurbu.com',
    name: 'Bumudurbu'
  },

  // Sitemap configuration
  sitemap: {
    sources: ['/api/__sitemap__/urls']
  },

  // Schema.org configuration for GEO (Generative Engine Optimization)
  schemaOrg: {
    identity: {
      type: 'LocalBusiness',
      name: 'Bumudurbu',
      logo: '/logo.png',
      image: '/logo.png',
      url: process.env.SITE_URL || 'https://bumudurbu.com',
      telephone: '+90 535 432 66 68',
      address: {
        streetAddress: 'Şarkiye Mah. Kazım Karabekir Cad. NO: 33/401',
        addressLocality: 'Altınordu',
        addressRegion: 'Ordu',
        postalCode: '52100',
        addressCountry: 'TR'
      },
      geo: {
        latitude: 40.9857,
        longitude: 37.8783
      },
      sameAs: [
        'https://instagram.com/bumudurbu',
        'https://facebook.com/bumudurbu'
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
    // Vercel uses NUXT_ prefix automatically, but we also check direct env vars for local dev
    instagramAccessToken: process.env.NUXT_INSTAGRAM_ACCESS_TOKEN || process.env.ACCESS_TOKEN,
    instagramBusinessId: process.env.NUXT_INSTAGRAM_BUSINESS_ID || process.env.INSTAGRAM_BUSINESS_ID,
    adminPassword: process.env.ADMIN_PASSWORD || 'admin123',
    // Public keys (Client-side)
    public: {
      siteUrl: process.env.SITE_URL || 'https://bumudurbu.com',
      gtmId: process.env.GTM_ID || '',
      businessType: process.env.BUSINESS_TYPE || 'PRODUCT', // PRODUCT, SERVICE, RESTAURANT, LOCAL_BUSINESS
      businessName: process.env.BUSINESS_NAME || 'Bumudurbu',
      businessProfession: process.env.BUSINESS_PROFESSION || 'Moda & Giyim',
      businessPhone: '+90 535 432 66 68',
      businessAddress: 'Şarkiye Mah. Kazım Karabekir Cad. NO: 33/401 Altınordu / Ordu',
      businessCity: 'Ordu',
      businessLatitude: 40.9857,
      businessLongitude: 37.8783,
      instagramUrl: 'https://instagram.com/bumudurbu',
      facebookUrl: 'https://facebook.com/bumudurbu'
    }
  },

  app: {
    head: {
      title: 'Bumudurbu - Instagram Vitrini',
      htmlAttrs: {
        lang: 'tr'
      },
      meta: [
        { name: 'description', content: 'Bumudurbu - En yeni ürünler ve paylaşımlar' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:locale', content: 'tr_TR' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Bumudurbu' },
        { name: 'apple-mobile-web-app-title', content: 'Arzu Özen' }
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
