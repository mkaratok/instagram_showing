// server/api/settings.get.ts
// Read site settings - with Vercel serverless fallback

const defaultSettings = {
    siteName: "Bumudurbu",
    slogan: "Instagram Vitrini",
    seoDescription: "Bumudurbu - En yeni ürünler ve paylaşımlar. Instagram üzerinden alışveriş.",
    contact: {
        phone: "+90 535 432 66 68",
        whatsapp: "905354326668",
        address: "Şarkiye Mah. Kazım Karabekir Cad. NO: 33/401 Altınordu / Ordu",
        city: "Ordu",
        googleMapsEmbed: "",
        email: ""
    },
    social: {
        instagram: "https://instagram.com/bumudurbu",
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
        profession: "Moda & Giyim"
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
