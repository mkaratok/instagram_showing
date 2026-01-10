// app/composables/useSiteSettings.ts
// Global composable for accessing site settings

export interface SocialLinks {
    // Sosyal Medya
    instagram: string
    facebook: string
    youtube: string
    tiktok: string
    twitter: string
    linkedin: string
    pinterest: string
    // Pazaryerleri
    trendyol: string
    hepsiburada: string
    n11: string
    pttavm: string
    amazonTr: string
    ciceksepeti: string
    sahibinden: string
    etsy: string
}

export interface SiteSettings {
    siteName: string
    slogan: string
    seoDescription: string
    contact: {
        phone: string
        whatsapp: string
        address: string
        city: string
        googleMapsEmbed: string
        email: string
    }
    social: SocialLinks
    appearance: {
        // Simplified: Just pick 2 base colors, system generates rest
        darkBaseColor: string   // Body color for dark mode (e.g., #1a222d)
        lightBaseColor: string  // Body color for light mode (e.g., #f6f3ef)
        logoUrl: string
        primaryColor: string    // Accent/brand color (e.g., #8134af)
    }
    business: {
        type: string
        profession: string
    }
    profile: {
        aboutTitle: string
        aboutText: string
        certificatesTitle: string
        certificates: Array<{ title: string; description: string }>
        servicesTitle: string
        services: Array<{ title: string; description: string; price: string }>
        ctaDescription: string
        ctaText: string
    }
}

const defaultSettings: SiteSettings = {
    siteName: "arzuozen",
    slogan: "Instagram Vitrini",
    seoDescription: "arzuozen - En yeni ürünler ve paylaşımlar.",
    contact: {
        phone: "+90 535 432 66 68",
        whatsapp: "905354326668",
        address: "Şarkiye Mah. Kazım Karabekir Cad. NO: 33/401 Altınordu / Ordu",
        city: "Ordu",
        googleMapsEmbed: "",
        email: ""
    },
    social: {
        instagram: "https://instagram.com/arzuozen",
        facebook: "",
        youtube: "",
        tiktok: "",
        twitter: "",
        linkedin: "",
        pinterest: "",
        trendyol: "",
        hepsiburada: "",
        n11: "",
        pttavm: "",
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
    },
    profile: {
        aboutTitle: "Hakkımda",
        aboutText: "Yaygın inanışın aksine, Lorem Ipsum rastgele bir metin değildir. Kökleri MÖ 45 yılına ait klasik bir Latin edebiyatı eserine dayanmaktadır.",
        certificatesTitle: "Sertifikalar",
        certificates: [
            { title: "1. SERTİFİKA", description: "Sertifika açıklaması buraya gelecek." },
            { title: "2. SERTİFİKA", description: "Sertifika açıklaması buraya gelecek." },
            { title: "3. SERTİFİKA", description: "Sertifika açıklaması buraya gelecek." }
        ],
        servicesTitle: "Hizmetlerimiz",
        services: [
            { title: "Hizmet 1", description: "Hizmet açıklaması", price: "İletişime Geçin" },
            { title: "Hizmet 2", description: "Hizmet açıklaması", price: "İletişime Geçin" },
            { title: "Hizmet 3", description: "Hizmet açıklaması", price: "İletişime Geçin" }
        ],
        ctaDescription: "Hizmetlerimiz hakkında detaylı bilgi almak için",
        ctaText: "WhatsApp ile İletişime Geç"
    }
}

export const useSiteSettings = () => {
    const settings = useState<SiteSettings>('siteSettings', () => defaultSettings)
    const loading = useState<boolean>('siteSettingsLoading', () => false)
    const error = useState<string | null>('siteSettingsError', () => null)

    const fetchSettings = async () => {
        loading.value = true
        error.value = null
        try {
            const data = await $fetch<SiteSettings>('/api/settings')
            if (data) {
                // Deep merge to preserve new fields
                settings.value = {
                    ...defaultSettings,
                    ...data,
                    contact: { ...defaultSettings.contact, ...data.contact },
                    social: { ...defaultSettings.social, ...data.social },
                    appearance: { ...defaultSettings.appearance, ...data.appearance },
                    business: { ...defaultSettings.business, ...data.business }
                }
            }
        } catch (e) {
            console.error('[useSiteSettings] Error fetching settings:', e)
            error.value = 'Ayarlar yüklenemedi'
        } finally {
            loading.value = false
        }
    }

    const saveSettings = async (newSettings: SiteSettings, password: string) => {
        loading.value = true
        error.value = null
        try {
            const response = await $fetch('/api/settings', {
                method: 'POST',
                headers: {
                    'x-admin-password': password
                },
                body: newSettings
            })
            settings.value = newSettings
            return { success: true, message: 'Ayarlar kaydedildi' }
        } catch (e: any) {
            const message = e?.data?.message || 'Ayarlar kaydedilemedi'
            error.value = message
            return { success: false, message }
        } finally {
            loading.value = false
        }
    }

    // Get active social links (non-empty) for frontend display
    const getActiveSocialLinks = () => {
        const social = settings.value.social
        return Object.entries(social)
            .filter(([_, url]) => url && url.trim().length > 0)
            .map(([key, url]) => ({ key, url }))
    }

    // Get all social URLs for GEO sameAs schema
    const getSameAsUrls = () => {
        const social = settings.value.social
        return Object.values(social).filter(url => url && url.trim().length > 0)
    }

    return {
        settings,
        loading,
        error,
        fetchSettings,
        saveSettings,
        getActiveSocialLinks,
        getSameAsUrls
    }
}
