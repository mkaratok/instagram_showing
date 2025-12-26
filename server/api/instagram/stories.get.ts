export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const accessToken = config.instagramAccessToken
    const businessId = config.instagramBusinessId

    // If no token or business ID, return empty
    if (!accessToken || !businessId) {
        return { data: [], error: 'Credentials missing' }
    }

    try {
        // Fetch Instagram stories from the business account
        // /{businessId}/stories returns active stories
        const fields = 'id,media_type,media_url,thumbnail_url,permalink,caption,timestamp'
        const url = `https://graph.facebook.com/v18.0/${businessId}/stories?fields=${fields}&access_token=${accessToken}`

        const response: any = await $fetch(url)

        // Graph API /stories endpoint only returns active stories (last 24h)
        // So we can just return the data.
        const activeStories = response.data || []

        return {
            data: activeStories,
            count: activeStories.length
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
