// server/api/cache/refresh.post.ts
// Manual cache invalidation endpoint
// Usage: POST /api/cache/refresh?type=all|posts|profile|stories
// 🔒 PROTECTED: Requires admin password

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    
    // 🔒 Admin password check
    const adminPassword = config.adminPassword
        || process.env.NUXT_ADMIN_PASSWORD
        || process.env.ADMIN_PASSWORD

    if (!adminPassword) {
        throw createError({
            statusCode: 500,
            message: 'Admin password not configured'
        })
    }

    const providedPassword = getHeader(event, 'x-admin-password')

    if (!providedPassword || providedPassword !== adminPassword) {
        throw createError({
            statusCode: 401,
            message: 'Yetkisiz erişim. Admin şifresi gerekli.'
        })
    }

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
