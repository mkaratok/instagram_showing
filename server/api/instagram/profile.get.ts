// server/api/instagram/profile.get.ts
// Profile API with 30-minute caching (profile data changes less frequently)

const CACHE_KEY = 'instagram:profile'
const CACHE_TTL = 30 * 60 // 30 minutes

export default defineEventHandler(async (event) => {
    const storage = useStorage('data')

    // Check cache first
    const cached = await storage.getItem(CACHE_KEY)
    if (cached) {
        const { data, timestamp } = cached as { data: any; timestamp: number }
        const age = (Date.now() - timestamp) / 1000

        if (age < CACHE_TTL) {
            console.log(`[Cache HIT] Profile from cache (age: ${Math.round(age)}s)`)
            return data
        }
    }

    const config = useRuntimeConfig()
    const accessToken = config.instagramAccessToken
    const businessId = config.instagramBusinessId

    const fields = 'username,name,biography,profile_picture_url,followers_count,follows_count,media_count,website'

    try {
        const response = await $fetch(`https://graph.facebook.com/v18.0/${businessId}?fields=${fields}&access_token=${accessToken}`)

        // Cache the response
        await storage.setItem(CACHE_KEY, {
            data: response,
            timestamp: Date.now()
        })
        console.log('[Cache SET] Profile cached for 30 min')

        return response
    } catch (error) {
        console.error('Instagram Profile API Error:', error)

        // Return stale cache as fallback
        if (cached) {
            const { data } = cached as { data: any }
            return data
        }
        return null
    }
})
