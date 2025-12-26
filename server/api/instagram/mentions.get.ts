// server/api/instagram/mentions.get.ts
export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const accessToken = config.instagramAccessToken
    const businessId = config.instagramBusinessId

    // Fields for tagged/mentioned media
    const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count,username'

    try {
        const response: any = await $fetch(`https://graph.facebook.com/v18.0/${businessId}/tags?fields=${fields}&access_token=${accessToken}`)
        return response
    } catch (error) {
        console.error('Instagram Mentions API Error:', error)
        return { data: [] }
    }
})
