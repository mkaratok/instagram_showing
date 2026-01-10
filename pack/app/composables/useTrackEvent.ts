// app/composables/useTrackEvent.ts
// Universal Event Tracking - Industry Agnostic

export function useTrackEvent() {
    const config = useRuntimeConfig()
    const businessType = config.public?.businessType || 'PRODUCT'

    function pushEvent(eventName: string, eventData: Record<string, any> = {}) {
        if (typeof window === 'undefined') return
        window.dataLayer = window.dataLayer || []
        window.dataLayer.push({
            event: eventName,
            business_type: businessType,
            ...eventData,
            event_timestamp: new Date().toISOString()
        })
    }

    function trackContactClick(data: { phone?: string; postId?: string; contentType?: string } = {}) {
        const labels: Record<string, string> = {
            PRODUCT: 'whatsapp_order',
            SERVICE: 'appointment_request',
            RESTAURANT: 'reservation_request',
            LOCAL_BUSINESS: 'contact_request'
        }
        pushEvent('contact_click', {
            event_category: 'engagement',
            event_label: labels[businessType] || 'contact',
            phone_number: data.phone,
            post_id: data.postId,
            content_type: data.contentType
        })
    }

    function trackDirectionClick(data: { address?: string; location?: string } = {}) {
        pushEvent('direction_click', {
            event_category: 'engagement',
            event_label: 'get_directions',
            address: data.address,
            location: data.location
        })
    }

    function trackPostView(data: { postId: string; title?: string; schemaType?: string; isProduct?: boolean }) {
        pushEvent('post_view', {
            event_category: 'content',
            post_id: data.postId,
            post_title: data.title,
            schema_type: data.schemaType,
            is_product: data.isProduct
        })
    }

    function trackProductView(data: { postId: string; name: string; price?: string; currency?: string }) {
        pushEvent('view_item', {
            event_category: 'ecommerce',
            items: [{
                item_id: data.postId,
                item_name: data.name,
                price: data.price,
                currency: data.currency || 'TRY'
            }]
        })
    }

    return { pushEvent, trackContactClick, trackDirectionClick, trackPostView, trackProductView }
}
