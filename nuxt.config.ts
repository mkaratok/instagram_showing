// nuxt.config.ts
export default defineNuxtConfig({
  // Force restart for Tailwind config
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],

  // Server-side storage for Token Management (No-DB solution)
  nitro: {
    storage: {
      data: {
        driver: 'fs',
        base: './.data/kv'
      }
    }
  },

  runtimeConfig: {
    // Private keys (Server-side only)
    instagramAccessToken: process.env.ACCESS_TOKEN,
    instagramBusinessId: process.env.INSTAGRAM_BUSINESS_ID,
    // Public keys (Client-side)
    public: {
      siteUrl: 'https://arzuozen.com'
    }
  },

  app: {
    head: {
      title: 'Arzu Özen Yoga Studio',
      meta: [
        { name: 'description', content: 'Yoga Studio in Ordu - Yoga, Meditation and Wellness' }
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    }
  }
})
