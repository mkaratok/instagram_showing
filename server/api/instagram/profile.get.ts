// server/api/instagram/profile.get.ts
// Profile API with 30-minute caching (profile data changes less frequently)

const CACHE_KEY = 'instagram:profile'
const CACHE_TTL = 30 * 60 // 30 minutes

export default defineEventHandler(async (event) => {
    const storage = useStorage('data')
    const config = useRuntimeConfig()
    const accessToken = config.instagramAccessToken
    const businessId = config.instagramBusinessId

    // Validate credentials exist
    if (!accessToken || !businessId) {
        console.error('[Profile] Missing credentials - Token:', !!accessToken, 'ID:', !!businessId)
        return null
    }

    // Check cache first
    const cached = await storage.getItem(CACHE_KEY)
    if (cached) {
        const { data, timestamp } = cached as { data: any; timestamp: number }
        const age = (Date.now() - timestamp) / 1000

        // Only use cache if data is valid (has followers_count)
        if (age < CACHE_TTL && data && typeof data.followers_count === 'number') {
            console.log(`[Cache HIT] Profile from cache (age: ${Math.round(age)}s)`)
            return data
        }
    }

    const fields = 'username,name,biography,profile_picture_url,followers_count,follows_count,media_count,website'

    try {
        console.log(`[Profile] Fetching fresh data for ID: ${businessId}`)
        const response: any = await $fetch(`https://graph.facebook.com/v18.0/${businessId}?fields=${fields}&access_token=${accessToken}`)

        // Validate response has required fields
        if (response && typeof response.followers_count === 'number') {
            // Cache the valid response
            await storage.setItem(CACHE_KEY, {
                data: response,
                timestamp: Date.now()
            })
            console.log(`[Cache SET] Profile cached - Followers: ${response.followers_count}, Posts: ${response.media_count}`)
            return response
        } else {
            console.error('[Profile] Invalid response - missing followers_count:', response)
            return cached ? (cached as any).data : null
        }
    } catch (error: any) {
        console.error('[Profile API Error]', error.message || error)

        // Return stale cache as fallback (only if it was valid)
        if (cached) {
            const { data } = cached as { data: any }
            if (data && typeof data.followers_count === 'number') {
                console.log('[Cache FALLBACK] Using stale profile data')
                return data
            }
        }
        return null
    }
})
