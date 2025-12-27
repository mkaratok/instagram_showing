// server/api/cache/refresh.post.ts
// Manual cache invalidation endpoint
// Usage: POST /api/cache/refresh?type=all|posts|profile|stories

export default defineEventHandler(async (event) => {
    const storage = useStorage('data')
    const query = getQuery(event)
    const type = (query.type as string) || 'all'

    const cacheKeys: Record<string, string> = {
        posts: 'instagram:posts',
        profile: 'instagram:profile',
        stories: 'instagram:stories'
    }

    const cleared: string[] = []

    try {
        if (type === 'all') {
            for (const [name, key] of Object.entries(cacheKeys)) {
                await storage.removeItem(key)
                cleared.push(name)
            }
        } else if (cacheKeys[type]) {
            await storage.removeItem(cacheKeys[type])
            cleared.push(type)
        } else {
            return { success: false, error: `Unknown cache type: ${type}` }
        }

        console.log(`[Cache CLEARED] ${cleared.join(', ')}`)

        return {
            success: true,
            cleared,
            message: `Cache cleared for: ${cleared.join(', ')}. Next request will fetch fresh data.`
        }
    } catch (error) {
        console.error('Cache refresh error:', error)
        return { success: false, error: 'Failed to clear cache' }
    }
})
