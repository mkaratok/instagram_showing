// server/api/instagram/mentions.get.ts
import { getInstagramCredentials } from '../../utils/storage'

export default defineEventHandler(async (event) => {
    const { accessToken, businessId } = getInstagramCredentials()

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
