// server/api/config.post.ts
// Update configuration (password protected)

import { writeConfig, updateInstagramCredentials } from '../utils/storage'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()

    // Check admin password
    const adminPassword = config.adminPassword
        || process.env.NUXT_ADMIN_PASSWORD
        || process.env.ADMIN_PASSWORD

    if (!adminPassword) {
        throw createError({
            statusCode: 500,
            message: 'ADMIN_PASSWORD environment variable is not configured.'
        })
    }

    const providedPassword = getHeader(event, 'x-admin-password')

    if (!providedPassword || providedPassword !== adminPassword) {
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

    // Instagram credentials are now read-only from .env
    // Admin panel can only update feature flags
    
    // Handle feature flags update
    if (body.features) {
        const result = await writeConfig({ features: body.features })

        if (!result.success) {
            throw createError({
                statusCode: 500,
                message: result.error || 'Kayıt hatası'
            })
        }
    }

    return {
        success: true,
        message: 'Yapılandırma başarıyla güncellendi.'
    }
})
