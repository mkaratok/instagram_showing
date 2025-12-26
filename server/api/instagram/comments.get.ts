// server/api/instagram/comments.get.ts
export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const accessToken = config.instagramAccessToken
    const query = getQuery(event)
    const mediaId = query.id as string

    if (!mediaId) {
        return { error: 'Media ID is required' }
    }

    // Fields for comments
    const fields = 'id,text,username,timestamp,like_count'

    try {
        const response: any = await $fetch(`https://graph.facebook.com/v18.0/${mediaId}/comments?fields=${fields}&access_token=${accessToken}`)
        return response
    } catch (error) {
        console.error('Instagram Comments API Error:', error)
        return { data: [] }
    }
})
