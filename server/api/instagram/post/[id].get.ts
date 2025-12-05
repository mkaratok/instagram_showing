// server/api/instagram/post/[id].get.ts
export default defineCachedEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    const accessToken = await getActiveToken()

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Post ID is required'
        })
    }

    const baseUrl = `https://graph.instagram.com/${id}`

    try {
        const response = await $fetch(`${baseUrl}?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count,children{media_url,thumbnail_url,media_type,id}&access_token=${accessToken}`)
        return response
    } catch (error) {
        console.error('Instagram API Error (Single Post):', error)
        throw createError({
            statusCode: 404,
            statusMessage: 'Post not found or API error'
        })
    }
}, {
    maxAge: 60 * 60, // Cache for 1 hour
    name: 'instagram-post-single',
    getKey: (event) => `instagram-post-${getRouterParam(event, 'id')}`
})
