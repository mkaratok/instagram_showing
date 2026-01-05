// server/api/instagram/mentions.get.ts
import { getInstagramCredentials } from '../../utils/storage'

export default defineEventHandler(async (event) => {
    let { accessToken, businessId } = getInstagramCredentials()

    // Env fallback (must be in event handler context)
    if (!accessToken || !businessId) {
        const config = useRuntimeConfig()
        accessToken = accessToken || config.instagramAccessToken || ''
        businessId = businessId || config.instagramBusinessId || ''
    }

    // Fields for tagged/mentioned media
    const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count,username'

    try {
        const response: any = await $fetch(`https://graph.facebook.com/v18.0/${businessId}/tags`, {
            query: { fields, access_token: accessToken }
        })
        return response
    } catch (error) {
        console.error('Instagram Mentions API Error:', error)
        return { data: [] }
    }
})
