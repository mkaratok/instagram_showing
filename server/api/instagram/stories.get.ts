export default defineEventHandler(async (event) => {
    const token = await getInstagramToken()

    if (!token) {
        return {
            data: [],
            error: 'No Instagram token available'
        }
    }

    try {
        // Fetch Instagram stories (media with media_product_type = STORY)
        const response = await $fetch(
            `https://graph.instagram.com/me/media?fields=id,media_type,media_url,thumbnail_url,permalink,caption,timestamp,media_product_type&access_token=${token}`
        )

        // Filter stories from last 24 hours
        const now = new Date().getTime()
        const twentyFourHoursAgo = now - (24 * 60 * 60 * 1000)

        const recentStories = response.data?.filter((media: any) => {
            const isStory = media.media_product_type === 'STORY'
            const timestamp = new Date(media.timestamp).getTime()
            const isRecent = timestamp >= twentyFourHoursAgo
            return isStory && isRecent
        }) || []

        return {
            data: recentStories,
            count: recentStories.length
        }
    } catch (error: any) {
        console.error('Instagram stories fetch error:', error)
        return {
            data: [],
            error: error.message,
            count: 0
        }
    }
})
