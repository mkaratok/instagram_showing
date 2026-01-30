// server/api/instagram/comments.get.ts
// Comments API with 10-minute cache per post

// In-memory cache for comments (key: mediaId)
declare global {
    var __commentsCache: Map<string, { data: any; timestamp: number }> | undefined
}

const CACHE_TTL = 10 * 60 // 10 minutes in seconds

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const accessToken = config.instagramAccessToken
    const query = getQuery(event)
    const mediaId = query.id as string

    if (!mediaId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Media ID is required'
        })
    }

    // Initialize cache if not exists
    if (!globalThis.__commentsCache) {
        globalThis.__commentsCache = new Map()
    }

    // Check cache
    const cached = globalThis.__commentsCache.get(mediaId)
    if (cached) {
        const age = (Date.now() - cached.timestamp) / 1000
        if (age < CACHE_TTL) {
            console.log(`[Comments] Cache HIT for ${mediaId} (age: ${Math.round(age)}s)`)
            return cached.data
        }
    }

    // Fields for comments - added 'replies' to fetch nested comments + username
    const fields = 'id,text,username,timestamp,like_count,replies{id,text,username,timestamp,like_count}'

    try {
        console.log(`[Comments] Fetching for ${mediaId}`)
        const response: any = await $fetch(`https://graph.facebook.com/v18.0/${mediaId}/comments?fields=${fields}&access_token=${accessToken}`)
        
        // Cache the response
        globalThis.__commentsCache.set(mediaId, {
            data: response,
            timestamp: Date.now()
        })
        
        return response
    } catch (error: any) {
        console.error('Instagram Comments API Error:', error)
        // Return stale cache if available
        if (cached) {
            console.log(`[Comments] Returning stale cache for ${mediaId}`)
            return cached.data
        }
        // Throw the error so the client knows something went wrong
        throw createError({
            statusCode: error.response?.status || 500,
            statusMessage: error.response?.statusText || 'Failed to fetch comments',
            data: error.response?._data
        })
    }
})
