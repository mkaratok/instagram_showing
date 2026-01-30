// server/api/settings.get.ts
// Read site settings - with Vercel serverless fallback

const defaultSettings = {
    siteName: "Portfolio",
    slogan: "My Showcase",
    seoDescription: "Welcome to my portfolio.",
    contact: {
        phone: "+90 555 555 55 55",
        whatsapp: "905555555555",
        address: "Address",
        city: "City",
        googleMapsEmbed: "",
        email: "info@example.com"
    },
    social: {
        instagram: "https://instagram.com/",
        facebook: "",
        youtube: "",
        tiktok: "",
        twitter: "",
        linkedin: "",
        pinterest: "",
        trendyol: "",
        hepsiburada: "",
        n11: "",
        amazonTr: "",
        ciceksepeti: "",
        sahibinden: "",
        etsy: ""
    },
    appearance: {
        darkBaseColor: "#1a222d",
        lightBaseColor: "#f6f3ef",
        logoUrl: "/logo.png",
        primaryColor: "#8134af"
    },
    business: {
        type: "PRODUCT",
        profession: "Showcase"
    }
}

export default defineEventHandler(async (event) => {
    // Try globalThis memory first (from POST fallback)
    const memorySettings = (globalThis as any).__siteSettings
    if (memorySettings) {
        console.log('[Settings] Returning from memory')
        return { ...defaultSettings, ...memorySettings }
    }

    // Try Nitro storage
    const storage = useStorage('data')

    try {
        const settings = await storage.getItem('site-settings.json')

        if (settings) {
            console.log('[Settings] Returning from Nitro storage')
            return { ...defaultSettings, ...settings }
        }
    } catch (error) {
        console.warn('[Settings] Nitro storage read failed:', error)
    }

    // Return defaults
    console.log('[Settings] Returning defaults')
    return defaultSettings
})
