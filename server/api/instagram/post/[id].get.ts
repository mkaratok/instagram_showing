// server/api/instagram/post/[id].get.ts
// Single Post API with 15-minute cache per post

// In-memory cache for individual posts (key: postId)
declare global {
    var __postCache: Map<string, { data: any; timestamp: number }> | undefined
}

const CACHE_TTL = 15 * 60 // 15 minutes in seconds

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const id = getRouterParam(event, 'id'); // URL'den ID'yi al

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Post ID is required'
        })
    }

    // Initialize cache if not exists
    if (!globalThis.__postCache) {
        globalThis.__postCache = new Map()
    }

    // Check cache
    const cached = globalThis.__postCache.get(id)
    if (cached) {
        const age = (Date.now() - cached.timestamp) / 1000
        if (age < CACHE_TTL) {
            console.log(`[Post] Cache HIT for ${id} (age: ${Math.round(age)}s)`)
            return cached.data
        }
    }

    // ÖNEMLİ: fields parametresi olmadan resim linki (media_url) GELMEZ!
    const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count';

    // config.instagramAccessToken kullanıyoruz çünkü nuxt.config.ts bu şekilde ayarlı
    const url = `https://graph.facebook.com/v18.0/${id}?fields=${fields}&access_token=${config.instagramAccessToken}`;

    try {
        console.log(`[Post] Fetching post ${id}`)
        const response = await $fetch(url);
        
        // Cache the response
        globalThis.__postCache.set(id, {
            data: response,
            timestamp: Date.now()
        })
        
        return response;
    } catch (error) {
        console.error("Post detay hatası:", error);
        // Return stale cache if available
        if (cached) {
            console.log(`[Post] Returning stale cache for ${id}`)
            return cached.data
        }
        // Hata olsa bile null dönmeyelim, hatayı fırlatalım ki frontend anlasın
        throw createError({
            statusCode: 404,
            statusMessage: 'Post not found or API Error',
        });
    }
});
