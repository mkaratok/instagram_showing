// app/composables/useSiteSettings.ts
// Global composable for accessing site settings

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
    }
    social: {
        instagram: string
        facebook: string
    }
    appearance: {
        primaryColor: string
        logoUrl: string
        darkMode: {
            headerBg: string
            bodyBg: string
        }
    }
    business: {
        type: string
        profession: string
    }
}

const defaultSettings: SiteSettings = {
    siteName: "Bumudurbu",
    slogan: "Instagram Vitrini",
    seoDescription: "Bumudurbu - En yeni ürünler ve paylaşımlar.",
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
                settings.value = { ...defaultSettings, ...data }
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

    return {
        settings,
        loading,
        error,
        fetchSettings,
        saveSettings
    }
}
