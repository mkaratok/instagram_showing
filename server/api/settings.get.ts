// server/api/settings.get.ts
// Read site settings from JSON file

import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'

const defaultSettings = {
    siteName: "Bumudurbu",
    slogan: "Instagram Vitrini",
    seoDescription: "Bumudurbu - En yeni ürünler ve paylaşımlar. Instagram üzerinden alışveriş.",
    contact: {
        phone: "+90 535 432 66 68",
        whatsapp: "905354326668",
        address: "Şarkiye Mah. Kazım Karabekir Cad. NO: 33/401 Altınordu / Ordu",
        city: "Ordu",
        googleMapsEmbed: ""
    },
    social: {
        instagram: "https://instagram.com/bumudurbu",
        facebook: "https://facebook.com/bumudurbu"
    },
    appearance: {
        primaryColor: "#8134af",
        logoUrl: "/logo.png",
        darkMode: {
            headerBg: "#080707",
            bodyBg: "#1a222d"
        }
    },
    business: {
        type: "PRODUCT",
        profession: "Moda & Giyim"
    }
}

export default defineEventHandler(async (event) => {
    // Use .data directory for persistent storage (same as token storage)
    const settingsPath = resolve(process.cwd(), '.data', 'site-settings.json')

    try {
        if (existsSync(settingsPath)) {
            const content = readFileSync(settingsPath, 'utf-8')
            return JSON.parse(content)
        } else {
            // Create default settings file
            const dir = dirname(settingsPath)
            if (!existsSync(dir)) {
                mkdirSync(dir, { recursive: true })
            }
            writeFileSync(settingsPath, JSON.stringify(defaultSettings, null, 2))
            return defaultSettings
        }
    } catch (error) {
        console.error('[Settings] Error reading settings:', error)
        return defaultSettings
    }
})
