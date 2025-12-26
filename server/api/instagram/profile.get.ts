// server/api/instagram/profile.get.ts
export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const accessToken = config.instagramAccessToken
    const businessId = config.instagramBusinessId

    // Fields requested + fields used by UI
    const fields = 'username,name,biography,profile_picture_url,followers_count,follows_count,media_count,website'

    try {
        const response = await $fetch(`https://graph.facebook.com/v18.0/${businessId}?fields=${fields}&access_token=${accessToken}`)
        return response
    } catch (error) {
        console.error('Instagram Profile API Error:', error)
        return null
    }
})
