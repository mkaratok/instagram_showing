// server/api/instagram/post/[id].get.ts

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const id = getRouterParam(event, 'id'); // URL'den ID'yi al

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Post ID is required'
        })
    }

    // ÖNEMLİ: fields parametresi olmadan resim linki (media_url) GELMEZ!
    const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count';

    // config.instagramAccessToken kullanıyoruz çünkü nuxt.config.ts bu şekilde ayarlı
    const url = `https://graph.facebook.com/v18.0/${id}?fields=${fields}&access_token=${config.instagramAccessToken}`;

    try {
        const response = await $fetch(url);
        return response;
    } catch (error) {
        console.error("Post detay hatası:", error);
        // Hata olsa bile null dönmeyelim, hatayı fırlatalım ki frontend anlasın
        throw createError({
            statusCode: 404,
            statusMessage: 'Post not found or API Error',
        });
    }
});
