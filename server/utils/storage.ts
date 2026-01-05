// server/utils/storage.ts
// Persistent configuration storage utility with Vercel compatibility

// Default configuration structure
export interface AppConfig {
    instagram: {
        accessToken: string
        businessId: string
    }
    features: {
        showReels: boolean
        showStories: boolean
        showMentions: boolean
    }
    lastUpdated?: string
}

const defaultConfig: AppConfig = {
    instagram: {
        accessToken: '',
        businessId: ''
    },
    features: {
        showReels: true,
        showStories: true,
        showMentions: true
    }
}

// In-memory storage (works on Vercel)
declare global {
    var __appConfig: AppConfig | undefined
}

/**
 * Read configuration from memory (and env fallback)
 */
export function readConfig(): AppConfig {
    // Check global memory first
    if (globalThis.__appConfig) {
        return globalThis.__appConfig
    }

    // Return defaults
    return { ...defaultConfig }
}

/**
 * Write configuration to memory
 */
export function writeConfig(config: Partial<AppConfig>): { success: boolean; error?: string } {
    try {
        // Merge with existing config
        const currentConfig = readConfig()
        const newConfig: AppConfig = {
            ...currentConfig,
            ...config,
            instagram: { ...currentConfig.instagram, ...config.instagram },
            features: { ...currentConfig.features, ...config.features },
            lastUpdated: new Date().toISOString()
        }

        // Store in global memory
        globalThis.__appConfig = newConfig
        console.log('[Storage] Config saved to memory')

        return { success: true }
    } catch (error: any) {
        console.error('[Storage] Write error:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Get Instagram credentials (with env fallback)
 */
export function getInstagramCredentials(): { accessToken: string; businessId: string } {
    const config = readConfig()

    // Fallback to env vars if config is empty
    if (!config.instagram.accessToken || !config.instagram.businessId) {
        const runtimeConfig = useRuntimeConfig()
        return {
            accessToken: config.instagram.accessToken || runtimeConfig.instagramAccessToken || '',
            businessId: config.instagram.businessId || runtimeConfig.instagramBusinessId || ''
        }
    }

    return config.instagram
}

/**
 * Update Instagram credentials
 */
export function updateInstagramCredentials(accessToken: string, businessId: string): { success: boolean; error?: string } {
    return writeConfig({
        instagram: { accessToken, businessId }
    })
}

/**
 * Get feature flags
 */
export function getFeatureFlags(): AppConfig['features'] {
    return readConfig().features
}

/**
 * Mask token for display (show only last 4 chars)
 */
export function maskToken(token: string): string {
    if (!token || token.length < 8) return '****'
    return '****' + token.slice(-4)
}
