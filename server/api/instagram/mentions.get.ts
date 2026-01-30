// server/api/instagram/mentions.get.ts
// Mentions API with 15-minute cache

// In-memory cache for mentions
declare global {
    var __mentionsCache: { data: any; timestamp: number } | undefined
}

const CACHE_TTL = 15 * 60 // 15 minutes in seconds

export default defineEventHandler(async (event) => {
    // Check cache first
    const memoryCache = globalThis.__mentionsCache
    if (memoryCache) {
        const age = (Date.now() - memoryCache.timestamp) / 1000
        if (age < CACHE_TTL) {
            console.log(`[Mentions] Cache HIT (age: ${Math.round(age)}s)`)
            return memoryCache.data
        }
    }

    const config = useRuntimeConfig()
    const accessToken = config.instagramAccessToken
    const businessId = config.instagramBusinessId

    // Fields for tagged/mentioned media
    const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count,username'

    try {
        console.log('[Mentions] Fetching tagged posts')
        const response: any = await $fetch(`https://graph.facebook.com/v18.0/${businessId}/tags`, {
            query: { fields, access_token: accessToken }
        })
        
        // Cache the response
        globalThis.__mentionsCache = {
            data: response,
            timestamp: Date.now()
        }
        
        return response
    } catch (error) {
        console.error('Instagram Mentions API Error:', error)
        // Return stale cache if available
        if (memoryCache) {
            console.log('[Mentions] Returning stale cache')
            return memoryCache.data
        }
        return { data: [] }
    }
})
