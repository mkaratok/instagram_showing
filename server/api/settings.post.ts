// server/api/settings.post.ts
// Save site settings - with Vercel serverless fallback

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()

    // Check multiple env var patterns for compatibility
    const adminPassword = config.adminPassword
        || process.env.NUXT_ADMIN_PASSWORD
        || process.env.ADMIN_PASSWORD

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
        console.log('[Settings] Auth failed')
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

    // Try Nitro storage first (works locally, may fail on Vercel free tier)
    const storage = useStorage('data')

    try {
        await storage.setItem('site-settings.json', body)
        console.log('[Settings] Saved to Nitro storage')

        return {
            success: true,
            message: 'Ayarlar başarıyla kaydedildi.'
        }
    } catch (storageError) {
        console.warn('[Settings] Nitro storage failed, using in-memory fallback:', storageError)

            // Fallback: Store in global memory (will reset on cold start)
            // This is acceptable for MVP - proper solution is Vercel KV or database
            ; (globalThis as any).__siteSettings = body

        return {
            success: true,
            message: 'Ayarlar oturum için kaydedildi. (Kalıcı depolama için Vercel KV gerekli)'
        }
    }
})
