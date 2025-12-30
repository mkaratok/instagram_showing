// server/api/settings.get.ts
// Read site settings - handles both local and Vercel environments

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
    // Use Nitro storage - works on both local and Vercel
    const storage = useStorage('data')

    try {
        const settings = await storage.getItem('site-settings.json')

        if (settings) {
            // Merge with defaults to ensure new fields exist
            return { ...defaultSettings, ...settings }
        } else {
            // Initialize with defaults
            await storage.setItem('site-settings.json', defaultSettings)
            return defaultSettings
        }
    } catch (error) {
        console.error('[Settings] Error reading settings:', error)
        return defaultSettings
    }
})
