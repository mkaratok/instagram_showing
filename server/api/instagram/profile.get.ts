// server/api/instagram/profile.get.ts
// Profile API with in-memory cache for fast profile picture loading

// In-memory cache for Vercel compatibility
declare global {
    var __profileCache: { data: any; timestamp: number } | undefined
}

const CACHE_TTL = 15 * 60 // 15 minutes in seconds

export default defineEventHandler(async (event) => {
    // Check in-memory cache first
    const memoryCache = globalThis.__profileCache
    if (memoryCache) {
        const age = (Date.now() - memoryCache.timestamp) / 1000
        if (age < CACHE_TTL) {
            console.log(`[Profile] Cache HIT (age: ${Math.round(age)}s)`)
            return memoryCache.data
        }
    }

    const config = useRuntimeConfig()
    const accessToken = config.instagramAccessToken
    const businessId = config.instagramBusinessId

    // Validate credentials exist
    if (!accessToken || !businessId) {
        console.error('[Profile] Missing credentials - Token:', !!accessToken, 'ID:', !!businessId)
        // Return stale cache if available
        if (memoryCache) {
            return memoryCache.data
        }
        return null
    }

    const fields = 'username,name,biography,profile_picture_url,followers_count,follows_count,media_count,website'

    try {
        console.log(`[Profile] Fetching data for ID: ${businessId}`)
        const response: any = await $fetch(`https://graph.facebook.com/v18.0/${businessId}`, {
            query: { fields, access_token: accessToken }
        })

        // Validate response has required fields
        if (response && typeof response.followers_count === 'number') {
            console.log(`[Profile] Success - Followers: ${response.followers_count}, Posts: ${response.media_count}`)
            
            // Cache the response
            globalThis.__profileCache = {
                data: response,
                timestamp: Date.now()
            }
            
            return response
        } else {
            console.error('[Profile] Invalid response - missing followers_count:', JSON.stringify(response))
            return memoryCache?.data || null
        }
    } catch (error: any) {
        console.error('[Profile API Error]', error.message || error)
        // Return stale cache as fallback
        return memoryCache?.data || null
    }
})
