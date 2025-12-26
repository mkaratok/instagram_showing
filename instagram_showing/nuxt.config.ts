// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@nuxt/icon'
  ],

  runtimeConfig: {
    // Server-side only (Private)
    instagramAccessToken: process.env.INSTAGRAM_ACCESS_TOKEN,
    instagramBusinessId: process.env.INSTAGRAM_BUSINESS_ID,
    // Client-side accessible (Public)
    public: {
      siteUrl: 'https://instagram-portfolio.com'
    }
  },

  app: {
    head: {
      title: 'Instagram Portfolio',
      htmlAttrs: {
        lang: 'tr'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Minimalist Instagram Portfolio' }
      ],
      bodyAttrs: {
        class: 'bg-neutral-950 text-white antialiased'
      }
    }
  },

  // Image optimization
  image: {
    domains: [
      'instagram.com',
      'cdninstagram.com',
      'scontent.cdninstagram.com',
      'scontent-fra3-1.cdninstagram.com',
      'scontent-fra5-2.cdninstagram.com' // Common CDN subdomains
    ],
    format: ['webp', 'jpg'],
    screens: {
      'xs': 320,
      'sm': 640,
      'md': 768,
      'lg': 1024,
      'xl': 1280,
      'xxl': 1536,
      '2xl': 1536
    }
  },

  // Tailwind CSS config
  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: 'tailwind.config.js'
  }
})
