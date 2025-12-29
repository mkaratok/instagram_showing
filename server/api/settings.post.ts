// server/api/settings.post.ts
// Save site settings to JSON file (password protected)

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const adminPassword = config.adminPassword || process.env.ADMIN_PASSWORD

    // Get password from header
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

    const settingsPath = resolve(process.cwd(), '.data', 'site-settings.json')

    try {
        const dir = dirname(settingsPath)
        if (!existsSync(dir)) {
            mkdirSync(dir, { recursive: true })
        }

        writeFileSync(settingsPath, JSON.stringify(body, null, 2), 'utf-8')

        return {
            success: true,
            message: 'Ayarlar başarıyla kaydedildi.'
        }
    } catch (error) {
        console.error('[Settings] Error saving settings:', error)
        throw createError({
            statusCode: 500,
            message: 'Ayarlar kaydedilemedi.'
        })
    }
})
