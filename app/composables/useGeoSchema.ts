// app/composables/useGeoSchema.ts
// Dynamic Schema.org generator for GEO optimization
// Generates Product, Service, or Article schemas based on content analysis

import type { GeoEnhancedContent } from '../../server/utils/geoContentEnhancer'

export interface GeoSchemaOptions {
    post: {
        id: string
        caption?: string
        media_url?: string
        timestamp?: string
        permalink?: string
        like_count?: number
        comments_count?: number
        username?: string
    }
    enhanced?: GeoEnhancedContent
    profile?: {
        username?: string
        followers_count?: number
        profile_picture_url?: string
        biography?: string
    }
}

export function useGeoSchema() {
    const config = useRuntimeConfig()
    const publicConfig = config.public

    const siteUrl = publicConfig.siteUrl || 'https://arzuozen.com'
    const businessName = publicConfig.businessName || 'arzuozen'
    const businessPhone = publicConfig.businessPhone || ''
    const businessAddress = publicConfig.businessAddress || ''
    const businessCity = publicConfig.businessCity || ''
    const instagramUrl = publicConfig.instagramUrl || ''
    const facebookUrl = publicConfig.facebookUrl || ''

    /**
     * Generate Organization schema (global, for all pages)
     */
    function getOrganizationSchema() {
        return {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: businessName,
            url: siteUrl,
            logo: `${siteUrl}/logo.png`,
            sameAs: [
                instagramUrl,
                facebookUrl
            ].filter(Boolean),
            contactPoint: {
                '@type': 'ContactPoint',
                telephone: businessPhone,
                contactType: 'customer service',
                areaServed: 'TR',
                availableLanguage: 'Turkish'
            }
        }
    }

    /**
     * Generate LocalBusiness schema (global, for all pages)
     */
    function getLocalBusinessSchema() {
        return {
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: businessName,
            image: `${siteUrl}/logo.png`,
            url: siteUrl,
            telephone: businessPhone,
            address: {
                '@type': 'PostalAddress',
                streetAddress: businessAddress,
                addressLocality: businessCity,
                addressCountry: 'TR'
            },
            geo: {
                '@type': 'GeoCoordinates',
                latitude: publicConfig.businessLatitude || 40.9857,
                longitude: publicConfig.businessLongitude || 37.8783
            },
            sameAs: [
                instagramUrl,
                facebookUrl
            ].filter(Boolean)
        }
    }

    /**
     * Generate Product schema
     */
    function getProductSchema(options: GeoSchemaOptions) {
        const { post, enhanced, profile } = options
        const price = enhanced?.entities.prices[0] || ''
        const priceValue = price.replace(/[^\d.,]/g, '').replace(',', '.')

        return {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: enhanced?.aiTitle || post.caption?.slice(0, 60) || 'Ürün',
            description: post.caption,
            image: post.media_url,
            url: `${siteUrl}/posts/${post.id}`,
            brand: {
                '@type': 'Brand',
                name: businessName
            },
            offers: {
                '@type': 'Offer',
                price: priceValue || undefined,
                priceCurrency: 'TRY',
                availability: 'https://schema.org/InStock',
                seller: {
                    '@type': 'Organization',
                    name: businessName
                }
            },
            aggregateRating: post.like_count ? {
                '@type': 'AggregateRating',
                ratingValue: Math.min(5, 4 + (post.like_count / 100)),
                reviewCount: post.comments_count || 1
            } : undefined
        }
    }

    /**
     * Generate Service schema
     */
    function getServiceSchema(options: GeoSchemaOptions) {
        const { post, enhanced, profile } = options

        return {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: enhanced?.aiTitle || post.caption?.slice(0, 60) || 'Hizmet',
            description: post.caption,
            image: post.media_url,
            url: `${siteUrl}/posts/${post.id}`,
            provider: {
                '@type': 'LocalBusiness',
                name: businessName,
                telephone: businessPhone,
                address: {
                    '@type': 'PostalAddress',
                    addressLocality: businessCity,
                    addressCountry: 'TR'
                }
            },
            areaServed: {
                '@type': 'City',
                name: businessCity
            }
        }
    }

    /**
     * Generate Article schema (preferred over SocialMediaPosting for AI authority)
     */
    function getArticleSchema(options: GeoSchemaOptions) {
        const { post, enhanced, profile } = options

        return {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: enhanced?.aiTitle || post.caption?.slice(0, 110) || 'Gönderi',
            description: post.caption?.slice(0, 200),
            image: post.media_url,
            url: `${siteUrl}/posts/${post.id}`,
            datePublished: post.timestamp,
            dateModified: post.timestamp,
            author: {
                '@type': 'Person',
                name: profile?.username || post.username || businessName,
                url: instagramUrl
            },
            publisher: {
                '@type': 'Organization',
                name: businessName,
                logo: {
                    '@type': 'ImageObject',
                    url: `${siteUrl}/logo.png`
                }
            },
            mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': `${siteUrl}/posts/${post.id}`
            },
            interactionStatistic: [
                {
                    '@type': 'InteractionCounter',
                    interactionType: 'https://schema.org/LikeAction',
                    userInteractionCount: post.like_count || 0
                },
                {
                    '@type': 'InteractionCounter',
                    interactionType: 'https://schema.org/CommentAction',
                    userInteractionCount: post.comments_count || 0
                }
            ],
            // Add keywords from hashtags
            keywords: enhanced?.entities.hashtags.map(h => h.replace('#', '')).join(', '),
            // Add mentions
            mentions: enhanced?.entities.mentions.map(m => ({
                '@type': 'Person',
                name: m.replace('@', '')
            }))
        }
    }

    /**
     * Generate FAQ schema if FAQ items exist
     */
    function getFaqSchema(enhanced: GeoEnhancedContent) {
        if (!enhanced.faq || enhanced.faq.length === 0) return null

        return {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: enhanced.faq.map(item => ({
                '@type': 'Question',
                name: item.question,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: item.answer
                }
            }))
        }
    }

    /**
     * Get appropriate schema based on content analysis
     */
    function getPostSchema(options: GeoSchemaOptions) {
        const { enhanced } = options
        const schemaType = enhanced?.recommendedSchema || 'Article'

        switch (schemaType) {
            case 'Product':
                return getProductSchema(options)
            case 'Service':
                return getServiceSchema(options)
            default:
                return getArticleSchema(options)
        }
    }

    /**
     * Get all schemas for a post page
     */
    function getAllPostSchemas(options: GeoSchemaOptions): Record<string, unknown>[] {
        const schemas: Record<string, unknown>[] = [
            getOrganizationSchema(),
            getPostSchema(options)
        ]

        if (options.enhanced?.faq && options.enhanced.faq.length > 0) {
            const faqSchema = getFaqSchema(options.enhanced)
            if (faqSchema) schemas.push(faqSchema)
        }

        return schemas
    }

    return {
        getOrganizationSchema,
        getLocalBusinessSchema,
        getProductSchema,
        getServiceSchema,
        getArticleSchema,
        getFaqSchema,
        getPostSchema,
        getAllPostSchemas
    }
}
