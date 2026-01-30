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
    siteName: "Portfolio",
    slogan: "My Showcase",
    seoDescription: "Welcome to my portfolio.",
    contact: {
        phone: "+90 555 555 55 55",
        whatsapp: "905555555555",
        address: "Address Line 1",
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
        profession: "Showcase"
    },
    profile: {
        aboutTitle: "About Me",
        aboutText: "Lorem ipsum dolor sit amet...",
        certificatesTitle: "Certificates",
        certificates: [
            { title: "Certificate 1", description: "Description..." },
            { title: "Certificate 2", description: "Description..." },
            { title: "Certificate 3", description: "Description..." }
        ],
        servicesTitle: "Services",
        services: [
            { title: "Service 1", description: "Description", price: "Contact" },
            { title: "Service 2", description: "Description", price: "Contact" },
            { title: "Service 3", description: "Description", price: "Contact" }
        ],
        ctaDescription: "Get in touch for details",
        ctaText: "Contact via WhatsApp"
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
            // Start with Runtime Config Defaults (Environment variables take precedence over hardcoded)

            // eslint-disable-next-line
            const config = useRuntimeConfig().public

            const envDefaults: SiteSettings = {
                ...defaultSettings,
                siteName: config.businessName || defaultSettings.siteName,
                slogan: config.businessProfession || defaultSettings.slogan,
                contact: {
                    ...defaultSettings.contact,
                    phone: config.businessPhone || defaultSettings.contact.phone,
                    address: config.businessAddress || defaultSettings.contact.address,
                    city: config.businessCity || defaultSettings.contact.city,
                },
                social: {
                    ...defaultSettings.social,
                    instagram: config.instagramUrl || defaultSettings.social.instagram,
                    facebook: config.facebookUrl || defaultSettings.social.facebook
                }
            }

            const data = await $fetch<SiteSettings>('/api/settings')

            // Smart Merge Logic:
            // 1. Start with Data (Saved Settings) OR Default Settings
            // 2. Override with Environment Variables ONLY IF they are explicitly set in runtimeConfig

            const baseSettings = { ...defaultSettings, ...(data || {}) }

            const finalSettings = {
                ...baseSettings,
                // Critical Identity Fields: Env var wins if present
                siteName: config.businessName || baseSettings.siteName,
                slogan: config.businessProfession || baseSettings.slogan,

                contact: {
                    ...baseSettings.contact,
                    phone: config.businessPhone || baseSettings.contact.phone,
                    address: config.businessAddress || baseSettings.contact.address,
                    city: config.businessCity || baseSettings.contact.city,
                },
                social: {
                    ...baseSettings.social,
                    instagram: config.instagramUrl || baseSettings.social.instagram,
                    facebook: config.facebookUrl || baseSettings.social.facebook
                },
                // Preserve appearance and profile from DB/JSON unless we want to control them via env too (usually not)
                appearance: { ...baseSettings.appearance },
                business: { ...baseSettings.business },
                profile: { ...baseSettings.profile }
            }

            // Ensure contact/social objects are fully merged (in case baseSettings had partial data)
            if (data?.contact) Object.assign(finalSettings.contact, data.contact)
            if (data?.social) Object.assign(finalSettings.social, data.social)

            // Re-apply Env Vars one last time to be absolute winner for identity (Safety net)
            if (config.businessName) finalSettings.siteName = config.businessName
            if (config.businessProfession) finalSettings.slogan = config.businessProfession
            if (config.businessPhone) finalSettings.contact.phone = config.businessPhone
            if (config.businessAddress) finalSettings.contact.address = config.businessAddress
            if (config.businessCity) finalSettings.contact.city = config.businessCity
            if (config.instagramUrl) finalSettings.social.instagram = config.instagramUrl

            settings.value = finalSettings
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
