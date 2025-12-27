// server/api/__sitemap__/urls.ts
// Dynamic sitemap generation from Instagram posts

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
    const config = useRuntimeConfig()
    const accessToken = config.instagramAccessToken
    const businessId = config.instagramBusinessId

    const fields = 'id,caption,timestamp,permalink'
    const limit = 50

    try {
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

        return [...staticPages, ...urls]

    } catch (error) {
        console.error('Sitemap generation error:', error)
        return [{ loc: '/', changefreq: 'daily', priority: 1.0 }]
    }
})
