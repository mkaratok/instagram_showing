// server/utils/geoContentEnhancer.ts
// GEO Content Enhancement Engine
// Transforms Instagram captions into AI-friendly, structured content

export interface GeoEnhancedContent {
    // Original content
    originalCaption: string

    // Intent classification
    intent: 'SALES' | 'SERVICE' | 'INFORMATIONAL'
    intentScore: number

    // AI-friendly title (first sentence)
    aiTitle: string

    // Structured paragraphs with semantic markup
    paragraphs: {
        text: string
        importance: 'high' | 'medium' | 'low'
        type: 'price' | 'contact' | 'description' | 'feature' | 'cta'
    }[]

    // Auto-generated FAQ
    faq: {
        question: string
        answer: string
    }[]

    // Extracted entities
    entities: {
        prices: string[]
        phones: string[]
        hashtags: string[]
        mentions: string[]
        keywords: string[]
    }

    // Schema.org type recommendation
    recommendedSchema: 'Product' | 'Service' | 'Article' | 'SocialMediaPosting'
}

// Turkish patterns for intent detection
const SALES_PATTERNS = [
    /fiyat/i, /₺/i, /tl/i, /indirim/i, /kampanya/i, /satış/i, /satılık/i,
    /stok/i, /adet/i, /sipariş/i, /kargo/i, /ödeme/i, /bedava/i, /ücretsiz/i,
    /beden/i, /renk/i, /numara/i, /xlarge/i, /small/i, /medium/i
]

const SERVICE_PATTERNS = [
    /randevu/i, /rezervasyon/i, /seans/i, /ders/i, /eğitim/i, /kurs/i,
    /hizmet/i, /danışmanlık/i, /tedavi/i, /terapi/i, /dm/i, /mesaj/i,
    /whatsapp/i, /iletişim/i, /ulaş/i, /ara/i
]

const PRICE_REGEX = /(?:₺|TL|tl)\s*[\d.,]+|[\d.,]+\s*(?:₺|TL|tl)/gi
const PHONE_REGEX = /(?:\+90|0)?[\s.-]?(?:5\d{2}|[1-4]\d{2})[\s.-]?\d{3}[\s.-]?\d{2}[\s.-]?\d{2}/g
const HASHTAG_REGEX = /#[\wğüşıöçĞÜŞİÖÇ]+/g
const MENTION_REGEX = /@[\w.]+/g

// FAQ generation patterns (Turkish)
const FAQ_TRIGGERS: { pattern: RegExp; question: string; answerTemplate: (match: string) => string }[] = [
    {
        pattern: /kargo\s*(?:bedava|ücretsiz|free)/i,
        question: 'Kargo ücretli mi?',
        answerTemplate: () => 'Hayır, kargo ücretsizdir.'
    },
    {
        pattern: /(?:₺|TL|tl)\s*([\d.,]+)|([\d.,]+)\s*(?:₺|TL|tl)/i,
        question: 'Fiyatı nedir?',
        answerTemplate: (match) => `Ürün fiyatı ${match}.`
    },
    {
        pattern: /randevu|rezervasyon/i,
        question: 'Randevu nasıl alabilirim?',
        answerTemplate: () => 'Instagram DM veya WhatsApp üzerinden randevu alabilirsiniz.'
    },
    {
        pattern: /dm|mesaj\s*at/i,
        question: 'Nasıl iletişime geçebilirim?',
        answerTemplate: () => 'Instagram DM üzerinden veya profildeki iletişim bilgilerinden ulaşabilirsiniz.'
    },
    {
        pattern: /stok(?:ta|da|\s*var)/i,
        question: 'Ürün stokta mı?',
        answerTemplate: () => 'Evet, ürün şu an stokta mevcuttur.'
    },
    {
        pattern: /son\s*(?:\d+|birkaç)\s*adet/i,
        question: 'Stok durumu nedir?',
        answerTemplate: (match) => `Sınırlı stok: ${match}.`
    },
    {
        pattern: /(\d+)\s*(?:gün|hafta|ay)\s*(?:içinde|de)\s*(?:teslim|kargo|gönderim)/i,
        question: 'Teslimat süresi ne kadar?',
        answerTemplate: (match) => `Teslimat süresi ${match}.`
    },
    {
        pattern: /iade|değişim/i,
        question: 'İade ve değişim var mı?',
        answerTemplate: () => 'İade ve değişim koşulları için satıcıyla iletişime geçebilirsiniz.'
    }
]

/**
 * Detect the intent of the caption
 */
function detectIntent(caption: string): { intent: GeoEnhancedContent['intent']; score: number } {
    const lowerCaption = caption.toLowerCase()

    let salesScore = 0
    let serviceScore = 0

    SALES_PATTERNS.forEach(pattern => {
        if (pattern.test(lowerCaption)) salesScore++
    })

    SERVICE_PATTERNS.forEach(pattern => {
        if (pattern.test(lowerCaption)) serviceScore++
    })

    if (salesScore > serviceScore && salesScore >= 2) {
        return { intent: 'SALES', score: salesScore }
    }
    if (serviceScore > salesScore && serviceScore >= 2) {
        return { intent: 'SERVICE', score: serviceScore }
    }
    return { intent: 'INFORMATIONAL', score: 0 }
}

/**
 * Extract the first meaningful sentence as AI title
 */
function extractAiTitle(caption: string): string {
    // Remove hashtags and mentions for title
    const cleanCaption = caption
        .replace(HASHTAG_REGEX, '')
        .replace(MENTION_REGEX, '')
        .trim()

    // Get first sentence (ending with . ! ? or newline)
    const firstSentence = cleanCaption.split(/[.!?\n]/)[0]?.trim()

    if (firstSentence && firstSentence.length > 10 && firstSentence.length < 120) {
        return firstSentence
    }

    // Fallback: first 100 chars
    return cleanCaption.slice(0, 100).trim() + (cleanCaption.length > 100 ? '...' : '')
}

/**
 * Extract entities from caption
 */
function extractEntities(caption: string): GeoEnhancedContent['entities'] {
    const prices = caption.match(PRICE_REGEX) || []
    const phones = caption.match(PHONE_REGEX) || []
    const hashtags = caption.match(HASHTAG_REGEX) || []
    const mentions = caption.match(MENTION_REGEX) || []

    // Extract keywords (nouns and important terms) - simplified version
    const cleanText = caption
        .replace(HASHTAG_REGEX, '')
        .replace(MENTION_REGEX, '')
        .replace(PRICE_REGEX, '')
        .replace(/[^\wğüşıöçĞÜŞİÖÇ\s]/g, ' ')

    const words = cleanText.split(/\s+/).filter(w => w.length > 4)
    const uniqueWords = [...new Set(words.map(w => w.toLowerCase()))]

    return {
        prices: prices.map(p => p.trim()),
        phones: phones.map(p => p.trim()),
        hashtags: hashtags.map(h => h.trim()),
        mentions: mentions.map(m => m.trim()),
        keywords: uniqueWords.slice(0, 10)
    }
}

/**
 * Generate FAQ from caption based on patterns
 */
function generateFaq(caption: string): GeoEnhancedContent['faq'] {
    const faq: GeoEnhancedContent['faq'] = []

    FAQ_TRIGGERS.forEach(trigger => {
        const match = caption.match(trigger.pattern)
        if (match) {
            faq.push({
                question: trigger.question,
                answer: trigger.answerTemplate(match[0])
            })
        }
    })

    return faq
}

/**
 * Break caption into semantic paragraphs
 */
function structureParagraphs(caption: string, entities: GeoEnhancedContent['entities']): GeoEnhancedContent['paragraphs'] {
    const paragraphs: GeoEnhancedContent['paragraphs'] = []

    // Split by double newlines or single newlines
    const lines = caption.split(/\n+/).filter(l => l.trim())

    lines.forEach(line => {
        const trimmed = line.trim()
        if (!trimmed) return

        let type: GeoEnhancedContent['paragraphs'][0]['type'] = 'description'
        let importance: GeoEnhancedContent['paragraphs'][0]['importance'] = 'medium'

        // Detect paragraph type
        if (PRICE_REGEX.test(trimmed)) {
            type = 'price'
            importance = 'high'
        } else if (PHONE_REGEX.test(trimmed) || /dm|mesaj|iletişim|whatsapp/i.test(trimmed)) {
            type = 'contact'
            importance = 'high'
        } else if (/satın|sipariş|al|ulaş|yaz/i.test(trimmed)) {
            type = 'cta'
            importance = 'high'
        } else if (/özellik|kalite|materyal|malzeme/i.test(trimmed)) {
            type = 'feature'
            importance = 'medium'
        }

        paragraphs.push({ text: trimmed, importance, type })
    })

    return paragraphs
}

/**
 * Determine recommended schema type based on content
 */
function getRecommendedSchema(intent: GeoEnhancedContent['intent'], entities: GeoEnhancedContent['entities']): GeoEnhancedContent['recommendedSchema'] {
    if (intent === 'SALES' && entities.prices.length > 0) {
        return 'Product'
    }
    if (intent === 'SERVICE') {
        return 'Service'
    }
    // AI prefers Article over SocialMediaPosting for authority
    return 'Article'
}

/**
 * Main function: Enhance Instagram caption for GEO
 */
export function enhanceContentForGeo(caption: string): GeoEnhancedContent {
    if (!caption || typeof caption !== 'string') {
        return {
            originalCaption: '',
            intent: 'INFORMATIONAL',
            intentScore: 0,
            aiTitle: '',
            paragraphs: [],
            faq: [],
            entities: { prices: [], phones: [], hashtags: [], mentions: [], keywords: [] },
            recommendedSchema: 'Article'
        }
    }

    const { intent, score: intentScore } = detectIntent(caption)
    const aiTitle = extractAiTitle(caption)
    const entities = extractEntities(caption)
    const faq = generateFaq(caption)
    const paragraphs = structureParagraphs(caption, entities)
    const recommendedSchema = getRecommendedSchema(intent, entities)

    return {
        originalCaption: caption,
        intent,
        intentScore,
        aiTitle,
        paragraphs,
        faq,
        entities,
        recommendedSchema
    }
}

/**
 * Helper: Format content as semantic HTML
 */
export function formatAsSemanticHtml(enhanced: GeoEnhancedContent): string {
    let html = ''

    // Title as H1
    if (enhanced.aiTitle) {
        html += `<h1>${enhanced.aiTitle}</h1>\n`
    }

    // Paragraphs with semantic markup
    enhanced.paragraphs.forEach(p => {
        if (p.importance === 'high') {
            html += `<p><strong>${p.text}</strong></p>\n`
        } else {
            html += `<p>${p.text}</p>\n`
        }
    })

    // FAQ as structured section
    if (enhanced.faq.length > 0) {
        html += `<section itemscope itemtype="https://schema.org/FAQPage">\n`
        enhanced.faq.forEach(item => {
            html += `  <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">\n`
            html += `    <h3 itemprop="name">${item.question}</h3>\n`
            html += `    <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">\n`
            html += `      <p itemprop="text">${item.answer}</p>\n`
            html += `    </div>\n`
            html += `  </div>\n`
        })
        html += `</section>\n`
    }

    return html
}
