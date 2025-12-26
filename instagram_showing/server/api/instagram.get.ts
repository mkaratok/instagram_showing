import { InstagramApiResponse, InstagramProfile, InstagramMedia } from '~/types'

export default defineEventHandler(async (event): Promise<InstagramApiResponse> => {
    const config = useRuntimeConfig()
    const accessToken = config.instagramAccessToken
    const businessId = config.instagramBusinessId

    if (!accessToken || !businessId) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Instagram Credentials not configured'
        })
    }

    try {
        // Parallel fetch for Profile and Media
        const profileFields = 'username,followers_count,media_count,profile_picture_url'
        const mediaFields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp'

        const [profileData, mediaData] = await Promise.all([
            $fetch<InstagramProfile>(`https://graph.facebook.com/v18.0/${businessId}?fields=${profileFields}&access_token=${accessToken}`),
            $fetch<{ data: InstagramMedia[] }>(`https://graph.facebook.com/v18.0/${businessId}/media?fields=${mediaFields}&access_token=${accessToken}&limit=10`)
        ])

        return {
            profile: profileData,
            media: mediaData.data || []
        }

    } catch (error: any) {
        console.error('Instagram API Error:', error)
        throw createError({
            statusCode: 502,
            statusMessage: 'Failed to fetch Instagram data',
            data: error
        })
    }
})
