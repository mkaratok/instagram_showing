// server/api/instagram/comments.get.ts
export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const accessToken = config.instagramAccessToken
    const query = getQuery(event)
    const mediaId = query.id as string

    if (!mediaId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Media ID is required'
        })
    }

    // Fields for comments - added 'replies' to fetch nested comments + username
    const fields = 'id,text,username,timestamp,like_count,replies{id,text,username,timestamp,like_count}'

    try {
        const response: any = await $fetch(`https://graph.facebook.com/v18.0/${mediaId}/comments?fields=${fields}&access_token=${accessToken}`)
        return response
    } catch (error: any) {
        console.error('Instagram Comments API Error:', error)
        // Throw the error so the client knows something went wrong
        throw createError({
            statusCode: error.response?.status || 500,
            statusMessage: error.response?.statusText || 'Failed to fetch comments',
            data: error.response?._data
        })
    }
})
