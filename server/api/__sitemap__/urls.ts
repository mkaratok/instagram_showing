// server/api/__sitemap__/urls.ts
// Dynamic sitemap generation from Instagram posts with 30-minute cache

// In-memory cache for sitemap URLs
declare global {
    var __sitemapCache: { data: any[]; timestamp: number } | undefined
}

const CACHE_TTL = 30 * 60 // 30 minutes in seconds

// Inline parseCaption for slug generation
function parseCaption(caption: string | null, postId: string) {
    if (!caption) return { slug: postId }
    const clean = caption.replace(/#[\wğüşıöçĞÜŞİÖÇ]+/g, '').trim()
    const words = clean.toLowerCase().replace(/[^a-zğüşıöç0-9\s]/gi, '').split(/\s+/).slice(0, 4).join('-')
        .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
        .replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').slice(0, 50)
    return { slug: words ? `${words}-${postId.slice(-8)}` : postId }
}

export default defineEventHandler(async () => {
    // Check cache first
    const memoryCache = globalThis.__sitemapCache
    if (memoryCache) {
        const age = (Date.now() - memoryCache.timestamp) / 1000
        if (age < CACHE_TTL) {
            console.log(`[Sitemap] Cache HIT (age: ${Math.round(age)}s)`)
            return memoryCache.data
        }
    }

    const config = useRuntimeConfig()
    const accessToken = config.instagramAccessToken
    const businessId = config.instagramBusinessId

    const fields = 'id,caption,timestamp,permalink'
    const limit = 50

    try {
        console.log('[Sitemap] Fetching posts for sitemap')
        const response: any = await $fetch(
            `https://graph.facebook.com/v18.0/${businessId}/media?fields=${fields}&limit=${limit}&access_token=${accessToken}`
        )

        const posts = response.data || []

        // Generate sitemap URLs with SEO-friendly slugs
        const urls = posts.map((post: any) => {
            const parsed = parseCaption(post.caption, post.id)
            return {
                loc: `/posts/${parsed.slug}`,
                lastmod: new Date(post.timestamp).toISOString(),
                changefreq: 'weekly',
                priority: 0.8
            }
        })

        // Add static pages
        const staticPages = [
            { loc: '/', changefreq: 'daily', priority: 1.0 },
            { loc: '/konum/altinordu', changefreq: 'monthly', priority: 0.6 },
            { loc: '/konum/fatsa', changefreq: 'monthly', priority: 0.6 },
            { loc: '/konum/unye', changefreq: 'monthly', priority: 0.6 }
        ]

        const result = [...staticPages, ...urls]

        // Cache the result
        globalThis.__sitemapCache = {
            data: result,
            timestamp: Date.now()
        }

        return result

    } catch (error) {
        console.error('Sitemap generation error:', error)
        // Return stale cache if available
        if (memoryCache) {
            console.log('[Sitemap] Returning stale cache')
            return memoryCache.data
        }
        return [{ loc: '/', changefreq: 'daily', priority: 1.0 }]
    }
})
