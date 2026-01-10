// app/plugins/gtm.client.ts
// Google Tag Manager - Client-side initialization

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()
    const gtmId = config.public.gtmId

    // Skip if no GTM ID configured
    if (!gtmId || gtmId === 'GTM-XXXXXX') {
        console.log('GTM: No valid GTM ID configured, skipping initialization')
        return
    }

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || []

    // GTM script injection
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`
    document.head.appendChild(script)

    // GTM initialization
    window.dataLayer.push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js'
    })

    // Initial pageview
    window.dataLayer.push({
        event: 'page_view',
        page_path: window.location.pathname,
        page_title: document.title
    })
})

// TypeScript declarations
declare global {
    interface Window {
        dataLayer: any[]
    }
}
