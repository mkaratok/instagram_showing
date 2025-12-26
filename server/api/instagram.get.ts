// server/api/instagram.get.ts
export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const accessToken = config.instagramAccessToken
    const businessId = config.instagramBusinessId

    // Initial request URL
    // Fetch 100 items per page to minimize requests
    const limit = 100
    const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count,children{media_url,thumbnail_url,media_type}'

    let url = `https://graph.facebook.com/v18.0/${businessId}/media?fields=${fields}&limit=${limit}&access_token=${accessToken}`

    let allPosts: any[] = []

    try {
        console.log('Starting recursive Instagram fetch...')

        while (url) {
            const response: any = await $fetch(url)

            if (response.data && Array.isArray(response.data)) {
                allPosts = [...allPosts, ...response.data]
            }

            // Check for next page
            if (response.paging && response.paging.next) {
                url = response.paging.next
            } else {
                url = '' // Stop loop
            }
        }

        console.log(`Fetched total ${allPosts.length} posts.`)

        // Sort by date (Newest first) just in case
        allPosts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

        return { data: allPosts }

    } catch (error) {
        console.error('Instagram Recursive API Error:', error)
        // Return whatever data we have, don't fail completely
        return { data: allPosts }
    }
})
