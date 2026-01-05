// server/api/instagram/profile.get.ts
// Profile API - Direct fetch without filesystem cache for Vercel compatibility

import { getInstagramCredentials } from '../../utils/storage'

export default defineEventHandler(async (event) => {
    const { accessToken, businessId } = getInstagramCredentials()

    // Validate credentials exist
    if (!accessToken || !businessId) {
        console.error('[Profile] Missing credentials - Token:', !!accessToken, 'ID:', !!businessId)
        return null
    }

    const fields = 'username,name,biography,profile_picture_url,followers_count,follows_count,media_count,website'

    try {
        console.log(`[Profile] Fetching data for ID: ${businessId}`)
        const response: any = await $fetch(`https://graph.facebook.com/v18.0/${businessId}?fields=${fields}&access_token=${accessToken}`)

        // Validate response has required fields
        if (response && typeof response.followers_count === 'number') {
            console.log(`[Profile] Success - Followers: ${response.followers_count}, Posts: ${response.media_count}`)
            return response
        } else {
            console.error('[Profile] Invalid response - missing followers_count:', JSON.stringify(response))
            return null
        }
    } catch (error: any) {
        console.error('[Profile API Error]', error.message || error)
        return null
    }
})
