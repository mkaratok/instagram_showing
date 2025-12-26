// server/api/instagram/post/[id].get.ts
export default defineCachedEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    const config = useRuntimeConfig()
    const accessToken = config.instagramAccessToken

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Post ID is required'
        })
    }

    const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count,children{media_url,thumbnail_url,media_type}'
    const url = `https://graph.facebook.com/v18.0/${id}?fields=${fields}&access_token=${accessToken}`

    try {
        const response: any = await $fetch(url)
        return response
    } catch (error: any) {
        console.error('Instagram API Error (Single Post):', error)
        throw createError({
            statusCode: 404, // Default to 404 but try to be descriptive
            statusMessage: 'Post not found or API error'
        })
    }
}, {
    maxAge: 60 * 60, // Cache for 1 hour
    name: 'instagram-post-single',
    getKey: (event) => `instagram-post-${getRouterParam(event, 'id')}`
})
