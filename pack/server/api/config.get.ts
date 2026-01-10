// server/api/config.get.ts
// Read configuration (with masked tokens for security)

import { readConfig, maskToken } from '../utils/storage'

export default defineEventHandler(async (event) => {
    const config = readConfig()

    // Return config with masked access token for security
    return {
        instagram: {
            accessToken: maskToken(config.instagram.accessToken),
            businessId: config.instagram.businessId,
            hasToken: !!config.instagram.accessToken
        },
        features: config.features,
        lastUpdated: config.lastUpdated || null
    }
})
