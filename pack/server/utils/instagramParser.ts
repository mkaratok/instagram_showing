// server/utils/instagramParser.ts
// Universal Instagram-to-SEO Parser - Industry Agnostic

export type BusinessType = 'PRODUCT' | 'SERVICE' | 'RESTAURANT' | 'LOCAL_BUSINESS'

export interface ParsedContent {
    // Basic SEO
    title: string
    description: string
    keywords: string[]
    slug: string
    altText: string

    // Content Analysis
    isProduct: boolean
    isService: boolean
    isMenuItem: boolean
    hasReservation: boolean
    hasFAQ: boolean

    // Extracted Data
    price?: { amount: string; currency: string }
    categories: string[]
    faqItems?: { question: string; answer: string }[]

    // Schema Recommendation
    recommendedSchema: 'Product' | 'Service' | 'MenuItem' | 'SocialMediaPosting' | 'FAQPage'
}

/**
 * Main parser function - Analyzes Instagram caption and returns structured data
 */
export function parseInstagramContent(
    caption: string | null,
    postId: string,
    mediaType: string = 'IMAGE',
    businessType: BusinessType = 'PRODUCT',
    businessName: string = 'Bumudurbu',
    city: string = 'Ordu'
): ParsedContent {
    const cleanCaption = caption || ''

    // Extract hashtags for keywords/categories
    const hashtagRegex = /#[\wğüşıöçĞÜŞİÖÇ]+/g
    const hashtags = cleanCaption.match(hashtagRegex) || []
    const keywords = hashtags.map(tag => tag.replace('#', ''))

    // Clean caption (without hashtags)
    const textOnly = cleanCaption.replace(hashtagRegex, '').trim()

    // Generate title from first sentence
    const title = generateTitle(textOnly)

    // Generate description (first 160 chars)
    const description = textOnly.slice(0, 160)

    // Generate SEO-friendly slug
    const slug = generateSlug(textOnly, postId)

    // Context Analysis
    const isProduct = detectProduct(cleanCaption)
    const isService = detectService(cleanCaption)
    const isMenuItem = businessType === 'RESTAURANT' && detectMenuItem(cleanCaption)
    const hasReservation = detectReservation(cleanCaption)
    const hasFAQ = cleanCaption.includes('?')

    // Extract price if product
    const price = isProduct ? extractPrice(cleanCaption) : undefined

    // Extract FAQ if present
    const faqItems = hasFAQ ? extractFAQ(cleanCaption) : undefined

    // Generate rich alt text for GEO
    const altText = generateAltText(title, mediaType, businessName, city)

    // Determine categories from hashtags
    const categories = extractCategories(keywords)

    // Recommend schema type based on analysis
    const recommendedSchema = determineSchema(isProduct, isService, isMenuItem, hasFAQ && faqItems?.length > 0)

    return {
        title,
        description,
        keywords,
        slug,
        altText,
        isProduct,
        isService,
        isMenuItem,
        hasReservation,
        hasFAQ,
        price,
        categories,
        faqItems,
        recommendedSchema
    }
}

// --- Helper Functions ---

function generateTitle(text: string): string {
    if (!text) return 'Gönderi'
    const firstSentence = text.match(/^[^.!?]+[.!?]?/)
    let title = firstSentence ? firstSentence[0].trim() : text.slice(0, 60)
    return title.length > 60 ? title.slice(0, 57) + '...' : title
}

function generateSlug(text: string, postId: string): string {
    if (!text) return postId
    const words = text
        .toLowerCase()
        .replace(/[^a-zğüşıöç0-9\s]/gi, '')
        .split(/\s+/)
        .slice(0, 4)
        .join('-')
        .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
        .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
        .replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-')
        .slice(0, 50)
    return words ? `${words}-${postId.slice(-8)}` : postId
}

function detectProduct(text: string): boolean {
    const patterns = [
        /\d+\s*(TL|₺|USD|\$|EUR|€)/i,
        /fiyat/i,
        /satış/i,
        /sipariş/i,
        /stok/i,
        /indirim/i,
        /kampanya/i,
        /ürün/i,
        /beden/i,
        /renk/i
    ]
    return patterns.some(p => p.test(text))
}

function detectService(text: string): boolean {
    const patterns = [
        /randevu/i,
        /seans/i,
        /hizmet/i,
        /danışmanlık/i,
        /eğitim/i,
        /kurs/i,
        /ders/i,
        /terapi/i,
        /konsultasyon/i,
        /muayene/i
    ]
    return patterns.some(p => p.test(text))
}

function detectMenuItem(text: string): boolean {
    const patterns = [
        /porsiyon/i,
        /içindekiler/i,
        /malzeme/i,
        /kalori/i,
        /menü/i,
        /yemek/i,
        /tatlı/i,
        /içecek/i
    ]
    return patterns.some(p => p.test(text))
}

function detectReservation(text: string): boolean {
    const patterns = [
        /randevu al/i,
        /rezervasyon/i,
        /yer ayırt/i,
        /masa/i,
        /tarih/i,
        /saat/i
    ]
    return patterns.some(p => p.test(text))
}

function extractPrice(text: string): { amount: string; currency: string } | undefined {
    const patterns = [
        /(\d+[\.,]?\d*)\s*(TL|₺)/i,
        /(\d+[\.,]?\d*)\s*(USD|\$)/i,
        /(\d+[\.,]?\d*)\s*(EUR|€)/i
    ]
    for (const pattern of patterns) {
        const match = text.match(pattern)
        if (match) {
            const amount = match[1].replace(',', '.')
            const curr = match[2].toUpperCase()
            let currency = 'TRY'
            if (curr === 'USD' || curr === '$') currency = 'USD'
            else if (curr === 'EUR' || curr === '€') currency = 'EUR'
            return { amount, currency }
        }
    }
    return undefined
}

function extractFAQ(text: string): { question: string; answer: string }[] {
    const faqs: { question: string; answer: string }[] = []
    const lines = text.split(/\n+/).filter(l => l.trim())
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('?') && i + 1 < lines.length) {
            const next = lines[i + 1].trim()
            if (!next.includes('?') && !next.startsWith('#')) {
                faqs.push({
                    question: lines[i].replace(/#[\wğüşıöçĞÜŞİÖÇ]+/g, '').trim(),
                    answer: next.replace(/#[\wğüşıöçĞÜŞİÖÇ]+/g, '').trim()
                })
            }
        }
    }
    return faqs
}

function generateAltText(title: string, mediaType: string, businessName: string, city: string): string {
    const type = mediaType === 'VIDEO' ? 'video' : 'görsel'
    return `${city}'de ${businessName} tarafından sunulan ${title} ${type}i`
}

function extractCategories(keywords: string[]): string[] {
    // Common category indicators
    const categoryWords = ['yeni', 'sezon', 'indirim', 'kampanya', 'özel', 'limited']
    return keywords.filter(k => !categoryWords.includes(k.toLowerCase())).slice(0, 5)
}

function determineSchema(
    isProduct: boolean,
    isService: boolean,
    isMenuItem: boolean,
    hasFAQ: boolean
): 'Product' | 'Service' | 'MenuItem' | 'SocialMediaPosting' | 'FAQPage' {
    if (hasFAQ) return 'FAQPage'
    if (isProduct) return 'Product'
    if (isService) return 'Service'
    if (isMenuItem) return 'MenuItem'
    return 'SocialMediaPosting'
}
