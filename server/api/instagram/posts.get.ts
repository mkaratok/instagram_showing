// server/api/instagram/posts.get.ts
export default defineCachedEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const accessToken = config.instagramAccessToken
    const businessId = config.instagramBusinessId
    const limit = 10

    // Fields requested + extra for UI (likes, comments, children for carousel)
    const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count,children{media_url,thumbnail_url,media_type}'

    try {
        const response = await $fetch(`https://graph.facebook.com/v18.0/${businessId}/media?fields=${fields}&limit=${limit}&access_token=${accessToken}`)
        console.log('Instagram Posts API Success')
        return response
    } catch (error) {
        console.error('Instagram Posts API Error:', error)
        return { data: [] }
    }
}, {
    maxAge: 60 * 15, // Cache for 15 minutes
    name: 'instagram-posts'
})
