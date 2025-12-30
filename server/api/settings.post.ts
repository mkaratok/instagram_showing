// server/api/settings.post.ts
// Save site settings - handles both local and Vercel environments

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()

    // Check multiple env var patterns for compatibility
    const adminPassword = config.adminPassword
        || process.env.NUXT_ADMIN_PASSWORD
        || process.env.ADMIN_PASSWORD

    // Debug log for troubleshooting (will appear in Vercel logs)
    console.log('[Settings] Admin password configured:', !!adminPassword)

    if (!adminPassword) {
        throw createError({
            statusCode: 500,
            message: 'ADMIN_PASSWORD environment variable is not configured on server.'
        })
    }

    // Get password from header
    const providedPassword = getHeader(event, 'x-admin-password')

    if (!providedPassword || providedPassword !== adminPassword) {
        console.log('[Settings] Auth failed. Provided:', !!providedPassword, 'Matches:', providedPassword === adminPassword)
        throw createError({
            statusCode: 401,
            message: 'Yetkisiz erişim. Şifre hatalı.'
        })
    }

    const body = await readBody(event)

    if (!body || typeof body !== 'object') {
        throw createError({
            statusCode: 400,
            message: 'Geçersiz veri formatı.'
        })
    }

    // On Vercel, we can't write to filesystem - use Nitro storage instead
    const storage = useStorage('data')

    try {
        await storage.setItem('site-settings.json', body)

        return {
            success: true,
            message: 'Ayarlar başarıyla kaydedildi.'
        }
    } catch (error) {
        console.error('[Settings] Error saving settings:', error)
        throw createError({
            statusCode: 500,
            message: 'Ayarlar kaydedilemedi. Vercel storage hatası olabilir.'
        })
    }
})
