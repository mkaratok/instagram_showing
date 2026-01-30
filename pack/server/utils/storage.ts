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
 * Read configuration from memory
 */
export function readConfig(): AppConfig {
    if (globalThis.__appConfig) {
        return globalThis.__appConfig
    }
    return { ...defaultConfig }
}

/**
 * Write configuration to memory
 */
export function writeConfig(config: Partial<AppConfig>): { success: boolean; error?: string } {
    try {
        const currentConfig = readConfig()
        const newConfig: AppConfig = {
            ...currentConfig,
            ...config,
            instagram: { ...currentConfig.instagram, ...config.instagram },
            features: { ...currentConfig.features, ...config.features },
            lastUpdated: new Date().toISOString()
        }
        globalThis.__appConfig = newConfig
        console.log('[Storage] Config saved to memory')
        return { success: true }
    } catch (error: any) {
        console.error('[Storage] Write error:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Get Instagram credentials from config
 * Note: Env fallback is handled in each API endpoint
 */
export function getInstagramCredentials(): { accessToken: string; businessId: string } {
    const config = readConfig()
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
