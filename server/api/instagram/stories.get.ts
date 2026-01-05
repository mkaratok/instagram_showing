// server/api/instagram/stories.get.ts
// Stories API with 5-minute caching and Vercel fallback

import { getInstagramCredentials } from '../../utils/storage'

// In-memory fallback for Vercel (no persistent storage on free tier)
declare global {
    var __storiesCache: { data: any[]; timestamp: number } | undefined
}

const CACHE_TTL = 5 * 60 // 5 minutes in seconds

export default defineEventHandler(async (event) => {
    let { accessToken, businessId } = getInstagramCredentials()

    // Env fallback (must be in event handler context)
    if (!accessToken || !businessId) {
        const config = useRuntimeConfig()
        accessToken = accessToken || config.instagramAccessToken || ''
        businessId = businessId || config.instagramBusinessId || ''
    }

    // Check in-memory cache first (works on Vercel)
    const memoryCache = globalThis.__storiesCache
    if (memoryCache) {
        const age = (Date.now() - memoryCache.timestamp) / 1000
        if (age < CACHE_TTL) {
            console.log(`[Stories] Memory cache HIT (age: ${Math.round(age)}s)`)
            return { data: memoryCache.data, count: memoryCache.data.length, fromCache: true }
        }
    }

    // Try Nitro storage as secondary cache
    let nitroCache: { data: any[]; timestamp: number } | null = null
    try {
        const storage = useStorage('data')
        const cached = await storage.getItem('instagram:stories')
        if (cached) {
            nitroCache = cached as { data: any[]; timestamp: number }
            const age = (Date.now() - nitroCache.timestamp) / 1000
            if (age < CACHE_TTL) {
                console.log(`[Stories] Nitro cache HIT (age: ${Math.round(age)}s)`)
                // Update memory cache
                globalThis.__storiesCache = nitroCache
                return { data: nitroCache.data, count: nitroCache.data.length, fromCache: true }
            }
        }
    } catch (storageError) {
        console.log('[Stories] Nitro storage not available, using memory only')
    }

    // Credentials check
    if (!accessToken || !businessId) {
        console.error('[Stories] Missing credentials - accessToken or businessId not set')
        // Return stale cache if available
        if (memoryCache) {
            return { data: memoryCache.data, count: memoryCache.data.length, stale: true, error: 'Credentials missing' }
        }
        return { data: [], error: 'Credentials missing', count: 0 }
    }

    // Fetch from Instagram API
    try {
        const fields = 'id,media_type,media_url,thumbnail_url,permalink,caption,timestamp'
        const url = `https://graph.facebook.com/v18.0/${businessId}/stories?fields=${fields}&access_token=${accessToken}`

        console.log(`[Stories] Fetching from Instagram API...`)
        const response: any = await $fetch(url)
        const activeStories = response.data || []

        // Create cache object
        const cacheData = {
            data: activeStories,
            timestamp: Date.now()
        }

        // Store in memory (always works)
        globalThis.__storiesCache = cacheData
        console.log(`[Stories] Memory cache SET (${activeStories.length} stories)`)

        // Try to store in Nitro storage (may fail on Vercel)
        try {
            const storage = useStorage('data')
            await storage.setItem('instagram:stories', cacheData)
            console.log(`[Stories] Nitro cache SET`)
        } catch (storageError) {
            console.log(`[Stories] Nitro storage write failed (expected on Vercel)`)
        }

        return {
            data: activeStories,
            count: activeStories.length,
            fromCache: false
        }
    } catch (error: any) {
        console.error('[Stories] Instagram API error:', error?.message || error)

        // Return stale cache as fallback
        if (memoryCache) {
            console.log('[Stories] Returning stale memory cache due to API error')
            return { data: memoryCache.data, count: memoryCache.data.length, stale: true }
        }
        if (nitroCache) {
            console.log('[Stories] Returning stale Nitro cache due to API error')
            return { data: nitroCache.data, count: nitroCache.data.length, stale: true }
        }

        return { data: [], error: error?.message || 'Unknown error', count: 0 }
    }
})
