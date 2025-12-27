// server/api/instagram/stories.get.ts
// Stories API with 5-minute caching (stories are time-sensitive)

const CACHE_KEY = 'instagram:stories'
const CACHE_TTL = 5 * 60 // 5 minutes

export default defineEventHandler(async (event) => {
    const storage = useStorage('data')

    // Check cache first
    const cached = await storage.getItem(CACHE_KEY)
    if (cached) {
        const { data, timestamp } = cached as { data: any[]; timestamp: number }
        const age = (Date.now() - timestamp) / 1000

        if (age < CACHE_TTL) {
            console.log(`[Cache HIT] Stories from cache (age: ${Math.round(age)}s)`)
            return { data, count: data.length, fromCache: true }
        }
    }

    const config = useRuntimeConfig()
    const accessToken = config.instagramAccessToken
    const businessId = config.instagramBusinessId

    if (!accessToken || !businessId) {
        return { data: [], error: 'Credentials missing' }
    }

    try {
        const fields = 'id,media_type,media_url,thumbnail_url,permalink,caption,timestamp'
        const url = `https://graph.facebook.com/v18.0/${businessId}/stories?fields=${fields}&access_token=${accessToken}`

        const response: any = await $fetch(url)
        const activeStories = response.data || []

        // Cache the response
        await storage.setItem(CACHE_KEY, {
            data: activeStories,
            timestamp: Date.now()
        })
        console.log(`[Cache SET] ${activeStories.length} stories cached for 5 min`)

        return {
            data: activeStories,
            count: activeStories.length,
            fromCache: false
        }
    } catch (error: any) {
        console.error('Instagram stories fetch error:', error)

        // Return stale cache as fallback
        if (cached) {
            const { data } = cached as { data: any[] }
            return { data, count: data.length, stale: true }
        }

        return { data: [], error: error.message, count: 0 }
    }
})
