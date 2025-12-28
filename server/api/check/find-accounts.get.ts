// server/api/debug/find-accounts.get.ts
// Diagnostic tool to find all Facebook Pages and their Instagram connections

interface AccountResult {
    sayfaAdi: string
    facebookPageId: string
    instagramBusinessId: string | null
    durum: string
}

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const accessToken = config.instagramAccessToken
    const expectedBusinessId = config.instagramBusinessId

    if (!accessToken) {
        return {
            error: 'ACCESS_TOKEN bulunamadı',
            accounts: []
        }
    }

    try {
        // Fetch all Facebook Pages the token has access to
        const url = `https://graph.facebook.com/v18.0/me/accounts?fields=name,id,instagram_business_account,access_token&access_token=${accessToken}`
        const response: any = await $fetch(url)

        if (!response.data || response.data.length === 0) {
            return {
                error: 'Token ile erişilebilen Facebook Sayfası bulunamadı. Token türünü kontrol edin (User Token vs Page Token).',
                tokenInfo: {
                    tokenLength: accessToken.length,
                    tokenPrefix: accessToken.substring(0, 10) + '...'
                },
                accounts: []
            }
        }

        // Process each page
        const accounts: AccountResult[] = response.data.map((page: any) => {
            const igId = page.instagram_business_account?.id || null
            const isMatch = igId === expectedBusinessId

            let durum = '❌ BAĞLI DEĞİL (Facebook Ayarlarından Instagram\'ı bağla)'
            if (igId) {
                if (isMatch) {
                    durum = '✅ BAĞLI VE ESLESIYOR (.env ile aynı ID)'
                } else {
                    durum = `⚠️ BAĞLI AMA FARKLI (.env: ${expectedBusinessId?.slice(-8)})`
                }
            }

            return {
                sayfaAdi: page.name,
                facebookPageId: page.id,
                instagramBusinessId: igId || 'YOK',
                durum
            }
        })

        // Also get token debug info
        const debugUrl = `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${accessToken}`
        let tokenInfo = null
        try {
            const debugRes: any = await $fetch(debugUrl)
            tokenInfo = {
                type: debugRes.data?.type || 'unknown',
                isValid: debugRes.data?.is_valid,
                scopes: debugRes.data?.scopes || [],
                expiresAt: debugRes.data?.expires_at
                    ? new Date(debugRes.data.expires_at * 1000).toLocaleString('tr-TR')
                    : 'Süresiz'
            }
        } catch (e) {
            // Ignore debug errors
        }

        return {
            envBusinessId: expectedBusinessId,
            tokenInfo,
            totalPages: accounts.length,
            accounts
        }

    } catch (error: any) {
        return {
            error: error.message || 'API isteği başarısız',
            suggestion: 'Token\'ın "pages_show_list" iznine sahip olduğundan emin olun.',
            accounts: []
        }
    }
})
