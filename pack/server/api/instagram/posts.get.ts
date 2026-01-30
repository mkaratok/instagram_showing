// server/api/instagram/posts.get.ts
export default defineCachedEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const accessToken = config.instagramAccessToken
    const businessId = config.instagramBusinessId

    // We want to fetch ALL posts, so we start with an initial limit
    // and then use the next paging cursor.
    const initialLimit = 50

    // Fields requested + extra for UI (likes, comments, children for carousel)
    const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count,children{media_url,thumbnail_url,media_type}'

    let allPosts: any[] = []
    let nextUrl = `https://graph.facebook.com/v18.0/${businessId}/media?fields=${fields}&limit=${initialLimit}&access_token=${accessToken}`

    try {
        // Recursive fetching loop
        while (nextUrl) {
            const response: any = await $fetch(nextUrl)

            if (response.data && Array.isArray(response.data)) {
                allPosts = [...allPosts, ...response.data]
            }

            // Check if there is a next page
            if (response.paging && response.paging.next) {
                nextUrl = response.paging.next
            } else {
                nextUrl = '' // Stop loop
            }
        }

        console.log(`Instagram Posts API Success. Fetched ${allPosts.length} posts.`)

        // Sort by timestamp (Newest -> Oldest)
        allPosts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

        return { data: allPosts }

    } catch (error) {
        console.error('Instagram Posts API Error:', error)
        // Return whatever we managed to fetch or empty
        return { data: allPosts.length > 0 ? allPosts : [] }
    }
}, {
    maxAge: 60 * 15, // Cache for 15 minutes
    name: 'instagram-posts'
})
