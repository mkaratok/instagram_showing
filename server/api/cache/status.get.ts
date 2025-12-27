// server/api/cache/status.get.ts
// Check cache status for all Instagram data

export default defineEventHandler(async (event) => {
    const storage = useStorage('data')

    const cacheConfigs = [
        { name: 'posts', key: 'instagram:posts', ttl: 15 * 60 },
        { name: 'profile', key: 'instagram:profile', ttl: 30 * 60 },
        { name: 'stories', key: 'instagram:stories', ttl: 5 * 60 }
    ]

    const status: Record<string, any> = {}

    for (const { name, key, ttl } of cacheConfigs) {
        const cached = await storage.getItem(key)

        if (cached) {
            const { data, timestamp } = cached as { data: any; timestamp: number }
            const age = (Date.now() - timestamp) / 1000
            const remaining = Math.max(0, ttl - age)
            const itemCount = Array.isArray(data) ? data.length : 1

            status[name] = {
                cached: true,
                items: itemCount,
                age: `${Math.round(age)}s`,
                ttl: `${ttl}s`,
                remaining: `${Math.round(remaining)}s`,
                expired: age >= ttl,
                lastUpdate: new Date(timestamp).toISOString()
            }
        } else {
            status[name] = {
                cached: false,
                message: 'No cache data'
            }
        }
    }

    return {
        timestamp: new Date().toISOString(),
        caches: status
    }
})
