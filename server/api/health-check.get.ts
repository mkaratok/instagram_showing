// server/api/health-check.get.ts
// Instagram API Health Check - Token, Permissions, Data Flow
// 🔒 PROTECTED: Requires admin password

interface CheckResult {
    name: string
    status: 'ok' | 'error' | 'warning'
    detail: string
}

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    
    // 🔒 Admin password check
    const adminPassword = config.adminPassword
        || process.env.NUXT_ADMIN_PASSWORD
        || process.env.ADMIN_PASSWORD

    if (!adminPassword) {
        throw createError({
            statusCode: 500,
            message: 'Admin password not configured'
        })
    }

    const providedPassword = getHeader(event, 'x-admin-password')

    if (!providedPassword || providedPassword !== adminPassword) {
        throw createError({
            statusCode: 401,
            message: 'Yetkisiz erişim. Admin şifresi gerekli.'
        })
    }

    const accessToken = config.instagramAccessToken
    const businessId = config.instagramBusinessId

    const results: CheckResult[] = []

    // A. TOKEN VALIDITY CHECK (debug_token)
    try {
        const debugUrl = `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${accessToken}`
        const debugRes: any = await $fetch(debugUrl)

        if (debugRes.data?.is_valid) {
            const expiresAt = debugRes.data.expires_at
            let expiryDetail = 'Süresiz'

            if (expiresAt && expiresAt > 0) {
                const expiryDate = new Date(expiresAt * 1000)
                const now = new Date()
                const diffMs = expiryDate.getTime() - now.getTime()
                const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
                const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
                expiryDetail = `Kalan: ${diffDays} Gün ${diffHours} Saat`
            }

            results.push({
                name: 'Access Token Geçerliliği',
                status: 'ok',
                detail: `Geçerli (${expiryDetail})`
            })

            // Check scopes
            const scopes = debugRes.data.scopes || []
            const requiredScopes = ['instagram_basic', 'pages_show_list', 'pages_read_engagement']
            const hasAllScopes = requiredScopes.every(s => scopes.includes(s))

            results.push({
                name: 'Gerekli İzinler',
                status: hasAllScopes ? 'ok' : 'warning',
                detail: scopes.join(', ') || 'İzin bulunamadı'
            })
        } else {
            results.push({
                name: 'Access Token Geçerliliği',
                status: 'error',
                detail: 'Token geçersiz veya süresi dolmuş'
            })
        }
    } catch (error: any) {
        results.push({
            name: 'Access Token Geçerliliği',
            status: 'error',
            detail: error.message || 'Debug token hatası'
        })
    }

    // B. INSTAGRAM ACCOUNT CONNECTION (/me/accounts)
    try {
        const accountsUrl = `https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`
        const accountsRes: any = await $fetch(accountsUrl)

        if (accountsRes.data && accountsRes.data.length > 0) {
            const page = accountsRes.data[0]
            const pageId = page.id
            const pageName = page.name

            // Get Instagram Business Account ID
            const igUrl = `https://graph.facebook.com/v18.0/${pageId}?fields=instagram_business_account&access_token=${accessToken}`
            const igRes: any = await $fetch(igUrl)

            const igId = igRes.instagram_business_account?.id
            const idMatch = igId === businessId

            results.push({
                name: 'Hesap Bağlantısı (ID)',
                status: idMatch ? 'ok' : 'warning',
                detail: `ID: ${igId || 'Bulunamadı'} (${pageName})${!idMatch ? ' - .env ile eşleşmiyor!' : ''}`
            })
        } else {
            results.push({
                name: 'Hesap Bağlantısı (ID)',
                status: 'error',
                detail: 'Bağlı Facebook sayfası bulunamadı'
            })
        }
    } catch (error: any) {
        results.push({
            name: 'Hesap Bağlantısı (ID)',
            status: 'error',
            detail: error.message || 'Hesap sorgusu hatası'
        })
    }

    // C. MEDIA DATA FLOW TEST
    try {
        const mediaUrl = `https://graph.facebook.com/v18.0/${businessId}/media?fields=id&limit=1&access_token=${accessToken}`
        const mediaRes: any = await $fetch(mediaUrl)

        if (mediaRes.data && mediaRes.data.length > 0) {
            results.push({
                name: 'Medya Veri Akışı',
                status: 'ok',
                detail: `Veri akışı çalışıyor (Test ID: ${mediaRes.data[0].id})`
            })
        } else {
            results.push({
                name: 'Medya Veri Akışı',
                status: 'warning',
                detail: 'Medya bulunamadı (Hesapta gönderi yok olabilir)'
            })
        }
    } catch (error: any) {
        results.push({
            name: 'Medya Veri Akışı',
            status: 'error',
            detail: error.message || 'Medya sorgusu hatası'
        })
    }

    // D. PROFILE DATA TEST (followers_count, media_count)
    try {
        const profileUrl = `https://graph.facebook.com/v18.0/${businessId}?fields=username,followers_count,media_count&access_token=${accessToken}`
        const profileRes: any = await $fetch(profileUrl)

        const hasFollowers = typeof profileRes.followers_count === 'number'
        const hasMediaCount = typeof profileRes.media_count === 'number'

        if (hasFollowers && hasMediaCount) {
            results.push({
                name: 'Profil Verileri (İstatistik)',
                status: 'ok',
                detail: `Takipçi: ${profileRes.followers_count}, Gönderi: ${profileRes.media_count}`
            })
        } else {
            results.push({
                name: 'Profil Verileri (İstatistik)',
                status: 'error',
                detail: 'followers_count/media_count alanları boş - instagram_manage_insights izni gerekli'
            })
        }
    } catch (error: any) {
        results.push({
            name: 'Profil Verileri (İstatistik)',
            status: 'error',
            detail: error.message || 'Profil sorgusu hatası'
        })
    }

    // E. WEBHOOK CONFIG CHECK
    const webhookToken = process.env.WEBHOOK_VERIFY_TOKEN
    results.push({
        name: 'Webhook Config',
        status: webhookToken ? 'ok' : 'warning',
        detail: webhookToken ? 'Tanımlı' : 'Tanımlı değil (Opsiyonel)'
    })

    // F. ENV CONFIG CHECK
    results.push({
        name: '.env Konfigürasyonu',
        status: accessToken && businessId ? 'ok' : 'error',
        detail: `Token: ${accessToken ? '✓' : '✗'}, Business ID: ${businessId ? '✓' : '✗'}`
    })

    return {
        timestamp: new Date().toISOString(),
        results
    }
})
