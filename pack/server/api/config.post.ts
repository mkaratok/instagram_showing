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

    // Handle Instagram credentials update
    if (body.instagram) {
        const { accessToken, businessId } = body.instagram

        // If accessToken is masked (starts with ****), don't update it
        const shouldUpdateToken = accessToken && !accessToken.startsWith('****')

        if (shouldUpdateToken || businessId) {
            // Validate credentials before saving
            if (shouldUpdateToken && businessId) {
                try {
                    const testUrl = `https://graph.facebook.com/v18.0/${businessId}?fields=username&access_token=${accessToken}`
                    const response: any = await $fetch(testUrl)

                    if (!response.username) {
                        throw new Error('Invalid response from Instagram API')
                    }

                    console.log(`[Config] Instagram validated: @${response.username}`)
                } catch (error: any) {
                    throw createError({
                        statusCode: 400,
                        message: `Instagram doğrulama başarısız: ${error.message}`
                    })
                }
            }

            // Update credentials
            const result = updateInstagramCredentials(
                shouldUpdateToken ? accessToken : '',
                businessId || ''
            )

            if (!result.success) {
                throw createError({
                    statusCode: 500,
                    message: result.error || 'Kayıt hatası'
                })
            }
        }
    }

    // Handle feature flags update
    if (body.features) {
        const result = writeConfig({ features: body.features })

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
