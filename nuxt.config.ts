// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true,
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    'nuxt-simple-sitemap',
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

  // Schema.org configuration
  schemaOrg: {
    identity: {
      type: 'LocalBusiness',
      name: 'Bumudurbu',
      logo: '/logo.png'
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
        { property: 'og:site_name', content: 'Bumudurbu' }
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    }
  }
})
