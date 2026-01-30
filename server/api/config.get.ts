// server/api/config.get.ts
// Read configuration (Instagram from .env, features from KV storage)

import { readConfig, maskToken } from '../utils/storage'

export default defineEventHandler(async (event) => {
    const runtimeConfig = useRuntimeConfig()
    const storageConfig = await readConfig()

    // Instagram credentials come from .env (runtime config)
    const accessToken = runtimeConfig.instagramAccessToken
    const businessId = runtimeConfig.instagramBusinessId

    // Return config with masked access token for security
    return {
        instagram: {
            accessToken: maskToken(accessToken),
            businessId: businessId,
            hasToken: !!accessToken
        },
        features: storageConfig.features,
        lastUpdated: storageConfig.lastUpdated || null
    }
})
