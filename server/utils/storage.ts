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
 * Read configuration from filesystem KV or memory
 */
export async function readConfig(): Promise<AppConfig> {
    // Try filesystem KV first
    try {
        const storage = useStorage('data')
        const saved = await storage.getItem('app-config.json') as AppConfig | null
        if (saved) {
            // Update memory cache
            globalThis.__appConfig = saved
            return saved
        }
    } catch (error) {
        console.warn('[Storage] Filesystem read failed, using memory/defaults')
    }
    
    // Fallback to memory
    if (globalThis.__appConfig) {
        return globalThis.__appConfig
    }
    
    // Final fallback to defaults
    return { ...defaultConfig }
}

/**
 * Write configuration to filesystem KV storage
 */
export async function writeConfig(config: Partial<AppConfig>): Promise<{ success: boolean; error?: string }> {
    try {
        const currentConfig = await readConfig()
        const newConfig: AppConfig = {
            ...currentConfig,
            ...config,
            instagram: { ...currentConfig.instagram, ...config.instagram },
            features: { ...currentConfig.features, ...config.features },
            lastUpdated: new Date().toISOString()
        }
        
        // Save to memory first
        globalThis.__appConfig = newConfig
        
        // Try to save to filesystem KV storage
        try {
            const storage = useStorage('data')
            await storage.setItem('app-config.json', newConfig)
            console.log('[Storage] Config saved to filesystem KV')
        } catch (fsError) {
            console.warn('[Storage] Filesystem write failed, using memory only:', fsError)
        }
        
        return { success: true }
    } catch (error: any) {
        console.error('[Storage] Write error:', error)
        return { success: false, error: error.message }
    }
}

/**
 * DEPRECATED: Instagram credentials are now managed via Runtime Config (.env)
 * These functions are kept for backward compatibility with config.post.ts
 */
export async function getInstagramCredentials(): Promise<{ accessToken: string; businessId: string }> {
    const config = await readConfig()
    return config.instagram
}

/**
 * DEPRECATED: Use .env file to update Instagram credentials
 */
export async function updateInstagramCredentials(accessToken: string, businessId: string): Promise<{ success: boolean; error?: string }> {
    return await writeConfig({
        instagram: { accessToken, businessId }
    })
}

/**
 * Get feature flags from filesystem KV
 */
export async function getFeatureFlags(): Promise<AppConfig['features']> {
    const config = await readConfig()
    return config.features
}

/**
 * Mask token for display (show only last 4 chars)
 */
export function maskToken(token: string): string {
    if (!token || token.length < 8) return '****'
    return '****' + token.slice(-4)
}
