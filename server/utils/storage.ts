// server/utils/storage.ts
// Persistent configuration storage utility

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'

// Config file path - relative to server directory
const CONFIG_PATH = join(process.cwd(), 'server', 'data', 'config.json')

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

// In-memory cache for Vercel (where file writes may not persist)
let memoryConfig: AppConfig | null = null

/**
 * Read configuration from file or memory
 */
export function readConfig(): AppConfig {
    // Check memory cache first (for Vercel)
    if (memoryConfig) {
        return memoryConfig
    }

    try {
        if (existsSync(CONFIG_PATH)) {
            const data = readFileSync(CONFIG_PATH, 'utf-8')
            const parsed = JSON.parse(data)
            const config = { ...defaultConfig, ...parsed }
            memoryConfig = config
            return config
        }
    } catch (error) {
        console.warn('[Storage] Failed to read config file:', error)
    }

    // Return defaults
    return { ...defaultConfig }
}

/**
 * Write configuration to file and memory
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

        // Update memory cache
        memoryConfig = newConfig

        // Try to write to file (may fail on Vercel)
        try {
            const dir = dirname(CONFIG_PATH)
            if (!existsSync(dir)) {
                mkdirSync(dir, { recursive: true })
            }
            writeFileSync(CONFIG_PATH, JSON.stringify(newConfig, null, 2), 'utf-8')
            console.log('[Storage] Config written to file')
        } catch (fileError) {
            console.warn('[Storage] File write failed (expected on Vercel):', fileError)
            // Memory cache is still updated, so this is acceptable
        }

        return { success: true }
    } catch (error: any) {
        console.error('[Storage] Write error:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Get Instagram credentials
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
