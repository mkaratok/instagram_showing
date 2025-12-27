// server/utils/instagram-parser.ts
// Instagram-to-SEO Transformer - "Zero Effort" SEO Automation

export interface ParsedCaption {
    title: string           // First sentence or 60 chars for <title> and <h1>
    description: string     // Full caption without hashtags for meta description
    keywords: string[]      // Extracted hashtags for meta keywords
    altText: string         // Title as fallback for image alt
    slug: string           // SEO-friendly URL slug from first 3-4 words + id
}

export interface SchemaData {
    type: 'Product' | 'SocialMediaPosting'
    name: string
    description: string
    datePublished: string   // ISO format
    author: string
    image: string
    price?: {
        amount: string
        currency: string
    }
}

/**
 * Parse Instagram caption into SEO-friendly components
 */
export function parseCaption(caption: string | null, postId: string): ParsedCaption {
    if (!caption) {
        return {
            title: 'Gönderi',
            description: '',
            keywords: [],
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

    // Generate SEO-friendly slug from first 3-4 words
    const slug = generateSlug(cleanCaption, postId)

    return {
        title,
        description: cleanCaption.slice(0, 160), // Meta description max ~160 chars
        keywords,
        altText: title,
        slug
    }
}

/**
 * Generate SEO-friendly URL slug
 */
function generateSlug(text: string, postId: string): string {
    if (!text) return postId

    // Take first 4 words
    const words = text
        .toLowerCase()
        .replace(/[^a-zğüşıöç0-9\s]/gi, '') // Keep Turkish chars
        .split(/\s+/)
        .slice(0, 4)
        .join('-')

    // Transliterate Turkish characters
    const slug = words
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .slice(0, 50)

    // Append last 8 chars of ID for uniqueness
    const shortId = postId.slice(-8)
    return slug ? `${slug}-${shortId}` : postId
}

/**
 * Detect if caption contains price information and extract it
 */
function extractPrice(caption: string): { amount: string; currency: string } | null {
    // Various price patterns
    const patterns = [
        /(\d+[\.,]?\d*)\s*(TL|₺)/i,           // 199 TL, 199,99 TL
        /(\d+[\.,]?\d*)\s*(USD|\$)/i,         // 50 USD, $50
        /(\d+[\.,]?\d*)\s*(EUR|€)/i,          // 50 EUR, €50
        /fiyat[ıi]?\s*:?\s*(\d+[\.,]?\d*)/i,  // Fiyat: 199
    ]

    for (const pattern of patterns) {
        const match = caption.match(pattern)
        if (match) {
            const amount = match[1].replace(',', '.')
            let currency = 'TRY'
            if (match[2]) {
                const curr = match[2].toUpperCase()
                if (curr === 'TL' || curr === '₺') currency = 'TRY'
                else if (curr === 'USD' || curr === '$') currency = 'USD'
                else if (curr === 'EUR' || curr === '€') currency = 'EUR'
            }
            return { amount, currency }
        }
    }
    return null
}

/**
 * Determine if post is product-like based on caption
 */
function isProductPost(caption: string): boolean {
    const productIndicators = [
        /fiyat/i,
        /\d+\s*(TL|₺|USD|\$|EUR|€)/i,
        /satış/i,
        /sipariş/i,
        /stok/i,
        /indirim/i,
        /kampanya/i,
    ]
    return productIndicators.some(pattern => pattern.test(caption))
}

/**
 * Generate JSON-LD Schema based on post content
 */
export function generateSchema(
    post: {
        id: string
        caption?: string
        timestamp: string
        media_url?: string
        thumbnail_url?: string
    },
    businessName: string = 'Bumudurbu'
): SchemaData {
    const caption = post.caption || ''
    const parsed = parseCaption(caption, post.id)
    const imageUrl = post.thumbnail_url || post.media_url || ''

    // Convert Instagram timestamp to ISO
    const datePublished = new Date(post.timestamp).toISOString()

    // Check if it's a product post
    if (isProductPost(caption)) {
        const price = extractPrice(caption)
        return {
            type: 'Product',
            name: parsed.title,
            description: parsed.description,
            datePublished,
            author: businessName,
            image: imageUrl,
            price: price || undefined
        }
    }

    // Default to SocialMediaPosting
    return {
        type: 'SocialMediaPosting',
        name: parsed.title,
        description: parsed.description,
        datePublished,
        author: businessName,
        image: imageUrl
    }
}

/**
 * Generate full JSON-LD script content
 */
export function generateJsonLd(schema: SchemaData, siteUrl: string = 'https://bumudurbu.com'): object {
    if (schema.type === 'Product' && schema.price) {
        return {
            '@context': 'https://schema.org',
            '@type': 'Product',
            'name': schema.name,
            'description': schema.description,
            'image': schema.image,
            'offers': {
                '@type': 'Offer',
                'price': schema.price.amount,
                'priceCurrency': schema.price.currency,
                'availability': 'https://schema.org/InStock'
            },
            'brand': {
                '@type': 'Brand',
                'name': schema.author
            }
        }
    }

    return {
        '@context': 'https://schema.org',
        '@type': 'SocialMediaPosting',
        'headline': schema.name,
        'description': schema.description,
        'image': schema.image,
        'datePublished': schema.datePublished,
        'author': {
            '@type': 'Organization',
            'name': schema.author,
            'url': siteUrl
        },
        'publisher': {
            '@type': 'Organization',
            'name': schema.author,
            'url': siteUrl
        }
    }
}
