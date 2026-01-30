// server/api/instagram/feed.get.ts
// Unified Instagram Feed API - Profile + Stories + Posts with 15-minute cache

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const storage = useStorage('data')

    // 1. Cache Check
    const cacheKey = 'instagram:feed'
    const cached = await storage.getItem(cacheKey)

    if (cached) {
        const { timestamp, data } = cached as { timestamp: number; data: any }
        const age = Date.now() - timestamp
        const maxAge = 15 * 60 * 1000 // 15 minutes

        if (age < maxAge) {
            console.log(`[Cache HIT] Feed from cache (age: ${Math.round(age / 1000)}s)`)
            return { ...data, fromCache: true, cacheAge: Math.round(age / 1000) }
        }
        console.log(`[Cache EXPIRED] Feed cache age: ${Math.round(age / 1000)}s, refreshing...`)
    }

    // 2. Fetch from Instagram API
    const token = config.instagramAccessToken
    const businessId = config.instagramBusinessId

    if (!token || !businessId) {
        throw createError({ statusCode: 500, statusMessage: 'Instagram API credentials missing' })
    }

    try {
        console.log('[API] Fetching Instagram feed (profile + stories + posts)...')

        // A) Profile
        const profileUrl = `https://graph.facebook.com/v18.0/${businessId}?fields=name,username,biography,profile_picture_url,followers_count,follows_count,media_count,website&access_token=${token}`

        // B) Stories (active 24h stories only)
        const storiesUrl = `https://graph.facebook.com/v18.0/${businessId}/stories?fields=id,media_type,media_url,thumbnail_url,permalink,timestamp&access_token=${token}`

        // C) Posts (last 50 with all needed fields)
        const postsUrl = `https://graph.facebook.com/v18.0/${businessId}/media?fields=id,caption,media_type,media_product_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count,children{media_url,thumbnail_url,media_type}&limit=50&access_token=${token}`

        // Parallel fetch for speed
        const [profileRes, storiesRes, postsRes] = await Promise.all([
            $fetch(profileUrl).catch(e => { console.error('Profile fetch error:', e); return null }),
            $fetch(storiesUrl).catch(e => { console.error('Stories fetch error:', e); return { data: [] } }),
            $fetch(postsUrl).catch(e => { console.error('Posts fetch error:', e); return { data: [] } })
        ]) as [any, any, any]

        // 3. Package the data
        const feedData = {
            profile: profileRes || null,
            stories: storiesRes?.data || [],
            posts: postsRes?.data || [],
            fetchedAt: new Date().toISOString()
        }

        console.log(`[API] Fetched: Profile=${!!profileRes}, Stories=${feedData.stories.length}, Posts=${feedData.posts.length}`)

        // 4. Save to cache
        await storage.setItem(cacheKey, {
            timestamp: Date.now(),
            data: feedData
        })
        console.log('[Cache SET] Feed cached for 15 minutes')

        return { ...feedData, fromCache: false }

    } catch (error) {
        console.error('[API ERROR] Instagram feed fetch failed:', error)

        // Fallback to stale cache
        if (cached) {
            const { data } = cached as { data: any }
            console.log('[Cache FALLBACK] Returning stale feed data')
            return { ...data, fromCache: true, stale: true }
        }

        throw createError({
            statusCode: 500,
            statusMessage: 'Instagram API request failed'
        })
    }
})
