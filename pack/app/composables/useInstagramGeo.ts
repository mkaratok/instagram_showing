// app/composables/useInstagramGeo.ts
// GEO (Generative Engine Optimization) - AI-Friendly Schema Generator

export interface GeoMetadata {
    title: string
    description: string
    keywords: string
    altText: string
    slug: string
    schemaType: 'Product' | 'SocialMediaPosting' | 'FAQPage'
    jsonLd: object
    faqItems?: { question: string; answer: string }[]
}

/**
 * Parse Instagram caption into SEO-friendly components
 */
function parseCaption(caption: string | null, postId: string) {
    if (!caption) {
        return {
            title: 'Gönderi',
            description: '',
            keywords: [] as string[],
            altText: 'Instagram Gönderi',
            slug: postId
        }
    }

    // Extract hashtags
    const hashtagRegex = /#[\wğüşıöçĞÜŞİÖÇ]+/g
    const hashtags = caption.match(hashtagRegex) || []
    const keywords = hashtags.map(tag => tag.replace('#', ''))

    // Remove hashtags for clean description
    const cleanCaption = caption.replace(hashtagRegex, '').trim()

    // Get first sentence or first 60 chars for title
    const firstSentenceMatch = cleanCaption.match(/^[^.!?]+[.!?]?/)
    let title = firstSentenceMatch ? firstSentenceMatch[0].trim() : cleanCaption.slice(0, 60)
    if (title.length > 60) {
        title = title.slice(0, 57) + '...'
    }

    // Generate SEO-friendly slug
    const words = cleanCaption
        .toLowerCase()
        .replace(/[^a-zğüşıöç0-9\s]/gi, '')
        .split(/\s+/)
        .slice(0, 4)
        .join('-')
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .slice(0, 50)

    const shortId = postId.slice(-8)
    const slug = words ? `${words}-${shortId}` : postId

    return {
        title,
        description: cleanCaption.slice(0, 160),
        keywords,
        altText: title,
        slug
    }
}

/**
 * Detect if post contains price information
 */
function isProductPost(caption: string): boolean {
    const patterns = [/fiyat/i, /\d+\s*(TL|₺|USD|\$|EUR|€)/i, /satış/i, /sipariş/i, /stok/i]
    return patterns.some(pattern => pattern.test(caption))
}

/**
 * Extract price from caption
 */
function extractPrice(caption: string): { amount: string; currency: string } | null {
    const patterns = [
        /(\d+[\.,]?\d*)\s*(TL|₺)/i,
        /(\d+[\.,]?\d*)\s*(USD|\$)/i,
        /(\d+[\.,]?\d*)\s*(EUR|€)/i
    ]
    for (const pattern of patterns) {
        const match = caption.match(pattern)
        if (match) {
            const amount = match[1].replace(',', '.')
            const curr = match[2].toUpperCase()
            let currency = 'TRY'
            if (curr === 'USD' || curr === '$') currency = 'USD'
            else if (curr === 'EUR' || curr === '€') currency = 'EUR'
            return { amount, currency }
        }
    }
    return null
}

/**
 * Generate AI-friendly alt text
 */
function generateAltText(caption: string, brandName: string = 'Portfolio'): string {
    if (!caption) return `${brandName} Instagram gönderi görseli`
    const words = caption.replace(/#[\wğüşıöçĞÜŞİÖÇ]+/g, '').trim().split(/\s+/).slice(0, 5).join(' ')
    return `${brandName} tarafından paylaşılan ${words} konulu görsel`
}

/**
 * Detect FAQ patterns in caption
 */
function detectFAQ(caption: string): { question: string; answer: string }[] {
    if (!caption || !caption.includes('?')) return []
    const faqs: { question: string; answer: string }[] = []
    const lines = caption.split(/\n+/).filter(line => line.trim())
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()
        if (line.includes('?') && i + 1 < lines.length) {
            const nextLine = lines[i + 1].trim()
            if (!nextLine.includes('?') && !nextLine.startsWith('#')) {
                faqs.push({
                    question: line.replace(/#[\wğüşıöçĞÜŞİÖÇ]+/g, '').trim(),
                    answer: nextLine.replace(/#[\wğüşıöçĞÜŞİÖÇ]+/g, '').trim()
                })
            }
        }
    }
    return faqs
}

/**
 * Generate LocalBusiness schema
 */
export function generateLocalBusinessSchema(config: {
    name: string
    address: string
    phone: string
    latitude: number
    longitude: number
    logoUrl: string
    instagramUrl: string
    facebookUrl?: string
    websiteUrl: string
}): object {
    return {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: config.name,
        image: config.logoUrl,
        telephone: config.phone,
        address: {
            '@type': 'PostalAddress',
            streetAddress: config.address,
            addressLocality: 'Ordu',
            addressRegion: 'Ordu',
            addressCountry: 'TR'
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: config.latitude,
            longitude: config.longitude
        },
        url: config.websiteUrl,
        sameAs: [config.instagramUrl, config.facebookUrl].filter(Boolean)
    }
}

/**
 * Main composable for Instagram GEO processing
 */
export function useInstagramGeo() {
    const config = useRuntimeConfig()

    function processPost(post: {
        id: string
        caption?: string
        timestamp: string
        media_url?: string
        thumbnail_url?: string
    }, brandName: string = 'Portfolio'): GeoMetadata {
        const caption = post.caption || ''
        const parsed = parseCaption(caption, post.id)
        const imageUrl = post.thumbnail_url || post.media_url || ''
        const datePublished = new Date(post.timestamp).toISOString()
        const faqItems = detectFAQ(caption)

        let schemaType: 'Product' | 'SocialMediaPosting' | 'FAQPage' = 'SocialMediaPosting'
        let jsonLd: object

        if (faqItems.length > 0) {
            schemaType = 'FAQPage'
            jsonLd = {
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: faqItems.map(faq => ({
                    '@type': 'Question',
                    name: faq.question,
                    acceptedAnswer: { '@type': 'Answer', text: faq.answer }
                }))
            }
        } else if (isProductPost(caption)) {
            schemaType = 'Product'
            const price = extractPrice(caption)
            jsonLd = {
                '@context': 'https://schema.org',
                '@type': 'Product',
                name: parsed.title,
                description: parsed.description,
                image: imageUrl,
                offers: price ? {
                    '@type': 'Offer',
                    price: price.amount,
                    priceCurrency: price.currency,
                    availability: 'https://schema.org/InStock'
                } : undefined,
                brand: { '@type': 'Brand', name: brandName }
            }
        } else {
            jsonLd = {
                '@context': 'https://schema.org',
                '@type': 'SocialMediaPosting',
                headline: parsed.title,
                description: parsed.description,
                image: imageUrl,
                datePublished,
                author: { '@type': 'Organization', name: brandName }
            }
        }

        return {
            title: `${parsed.title} | ${brandName}`,
            description: parsed.description,
            keywords: parsed.keywords.join(', '),
            altText: generateAltText(caption, brandName),
            slug: parsed.slug,
            schemaType,
            jsonLd,
            faqItems: faqItems.length > 0 ? faqItems : undefined
        }
    }

    return {
        processPost,
        generateLocalBusinessSchema,
        generateAltText
    }
}
