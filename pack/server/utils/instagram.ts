// server/utils/instagram.ts
export const getActiveToken = async () => {
    const config = useRuntimeConfig()
    // Try to get updated token from storage
    const storedToken = await useStorage('data').getItem('ig_access_token')
    // Fallback to env variable
    return storedToken || config.instagramAccessToken
}
