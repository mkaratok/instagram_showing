// server/api/instagram.get.ts
// Instagram API with 15-minute caching to prevent rate limiting

const CACHE_KEY = 'instagram:posts'
const CACHE_TTL = 15 * 60 // 15 minutes in seconds

export default defineEventHandler(async (event) => {
    const storage = useStorage('data')
    const config = useRuntimeConfig()

    // Check cache first
    const cached = await storage.getItem(CACHE_KEY)
    if (cached) {
        const { data, timestamp } = cached as { data: any[]; timestamp: number }
        const age = (Date.now() - timestamp) / 1000

        if (age < CACHE_TTL) {
            console.log(`[Cache HIT] Serving ${data.length} posts from cache (age: ${Math.round(age)}s)`)
            return { data, fromCache: true, cacheAge: Math.round(age) }
        }
        console.log(`[Cache EXPIRED] Cache age: ${Math.round(age)}s, refreshing...`)
    }

    // Get credentials from Runtime Config (.env)
    const accessToken = config.instagramAccessToken
    const businessId = config.instagramBusinessId

    const limit = 100
    const fields = 'id,caption,media_type,media_product_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count,children{media_url,thumbnail_url,media_type}'

    let url = `https://graph.facebook.com/v18.0/${businessId}/media?fields=${encodeURIComponent(fields)}&limit=${limit}&access_token=${accessToken}`
    let allPosts: any[] = []

    try {
        console.log('[API] Starting Instagram fetch...')

        while (url) {
            const response: any = await $fetch(url)

            if (response.data && Array.isArray(response.data)) {
                allPosts = [...allPosts, ...response.data]
            }

            // Check for next page
            if (response.paging && response.paging.next) {
                url = response.paging.next
            } else {
                url = ''
            }
        }

        console.log(`[API] Fetched ${allPosts.length} posts from Instagram`)

        // Sort by date (Newest first)
        allPosts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

        // Save to cache
        await storage.setItem(CACHE_KEY, {
            data: allPosts,
            timestamp: Date.now()
        })
        console.log(`[Cache SET] Cached ${allPosts.length} posts for ${CACHE_TTL}s`)

        return { data: allPosts, fromCache: false }

    } catch (error) {
        console.error('[API ERROR] Instagram fetch failed:', error)

        // If we have stale cache, return it as fallback
        if (cached) {
            const { data } = cached as { data: any[] }
            console.log(`[Cache FALLBACK] Returning stale cache with ${data.length} posts`)
            return { data, fromCache: true, stale: true }
        }

        return { data: allPosts, error: true }
    }
})
