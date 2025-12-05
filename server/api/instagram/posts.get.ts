// server/api/instagram/posts.get.ts
export default defineCachedEventHandler(async (event) => {
    const accessToken = await getActiveToken()
    const baseUrl = 'https://graph.instagram.com/me/media'

    try {
        const response = await $fetch(`${baseUrl}?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count,children{media_url,thumbnail_url,media_type,id}&access_token=${accessToken}`)
        return response
    } catch (error) {
        console.error('Instagram API Error:', error)
        // Return mock data structure if API fails (for development continuity)
        return { data: [] }
    }
}, {
    maxAge: 60 * 15, // Cache for 15 minutes
    name: 'instagram-posts'
})
