// app/composables/useUniversalSchema.ts
// Universal Schema Generator - Industry Agnostic

import type { ParsedContent } from '~/server/utils/instagramParser'

type BusinessType = 'PRODUCT' | 'SERVICE' | 'RESTAURANT' | 'LOCAL_BUSINESS'

export function useUniversalSchema() {
    const config = useRuntimeConfig()
    const businessType = (config.public.businessType || 'PRODUCT') as BusinessType
    const businessName = config.public.businessName || 'Business'
    const businessProfession = config.public.businessProfession || ''
    const businessCity = config.public.businessCity || 'Türkiye'
    const siteUrl = config.public.siteUrl || ''

    /**
     * Generate schema based on parsed content and business type
     */
    function generateSchema(
        parsed: ParsedContent,
        post: { id: string; timestamp: string; media_url?: string; thumbnail_url?: string }
    ): object[] {
        const schemas: object[] = []
        const imageUrl = post.thumbnail_url || post.media_url || ''
        const datePublished = new Date(post.timestamp).toISOString()

        // Primary Schema based on content analysis
        switch (parsed.recommendedSchema) {
            case 'Product':
                schemas.push(generateProductSchema(parsed, imageUrl))
                break
            case 'Service':
                schemas.push(generateServiceSchema(parsed, imageUrl, datePublished))
                break
            case 'MenuItem':
                schemas.push(generateMenuItemSchema(parsed, imageUrl))
                break
            case 'FAQPage':
                if (parsed.faqItems?.length) {
                    schemas.push(generateFAQSchema(parsed.faqItems))
                }
                break
            default:
                schemas.push(generateSocialMediaPostingSchema(parsed, imageUrl, datePublished))
        }

        // Always add LocalBusiness for Knowledge Graph
        schemas.push(generateLocalBusinessSchema())

        return schemas
    }

    function generateProductSchema(parsed: ParsedContent, imageUrl: string): object {
        return {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: parsed.title,
            description: parsed.description,
            image: imageUrl,
            brand: {
                '@type': 'Brand',
                name: businessName
            },
            offers: parsed.price ? {
                '@type': 'Offer',
                price: parsed.price.amount,
                priceCurrency: parsed.price.currency,
                availability: 'https://schema.org/InStock',
                seller: {
                    '@type': 'Organization',
                    name: businessName
                }
            } : undefined,
            category: parsed.categories.join(' > ')
        }
    }

    function generateServiceSchema(parsed: ParsedContent, imageUrl: string, datePublished: string): object {
        const schemaType = businessType === 'SERVICE' ? 'ProfessionalService' : 'Service'
        return {
            '@context': 'https://schema.org',
            '@type': schemaType,
            name: parsed.title,
            description: parsed.description,
            image: imageUrl,
            provider: {
                '@type': 'LocalBusiness',
                name: businessName,
                priceRange: parsed.price ? `${parsed.price.amount} ${parsed.price.currency}` : '₺₺'
            },
            areaServed: {
                '@type': 'City',
                name: businessCity
            },
            serviceType: businessProfession
        }
    }

    function generateMenuItemSchema(parsed: ParsedContent, imageUrl: string): object {
        return {
            '@context': 'https://schema.org',
            '@type': 'MenuItem',
            name: parsed.title,
            description: parsed.description,
            image: imageUrl,
            offers: parsed.price ? {
                '@type': 'Offer',
                price: parsed.price.amount,
                priceCurrency: parsed.price.currency
            } : undefined,
            menuAddOn: parsed.categories.length ? parsed.categories : undefined
        }
    }

    function generateFAQSchema(faqItems: { question: string; answer: string }[]): object {
        return {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqItems.map(faq => ({
                '@type': 'Question',
                name: faq.question,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: faq.answer
                }
            }))
        }
    }

    function generateSocialMediaPostingSchema(parsed: ParsedContent, imageUrl: string, datePublished: string): object {
        return {
            '@context': 'https://schema.org',
            '@type': 'SocialMediaPosting',
            headline: parsed.title,
            description: parsed.description,
            image: imageUrl,
            datePublished,
            author: {
                '@type': 'Organization',
                name: businessName,
                url: siteUrl
            },
            publisher: {
                '@type': 'Organization',
                name: businessName,
                url: siteUrl
            }
        }
    }

    function generateLocalBusinessSchema(): object {
        // Determine LocalBusiness subtype based on businessType
        let schemaType = 'LocalBusiness'
        if (businessType === 'RESTAURANT') schemaType = 'Restaurant'
        else if (businessType === 'SERVICE') schemaType = 'ProfessionalService'

        return {
            '@context': 'https://schema.org',
            '@type': schemaType,
            name: businessName,
            description: `${businessCity}'de ${businessProfession} hizmetleri`,
            telephone: config.public.businessPhone,
            address: {
                '@type': 'PostalAddress',
                streetAddress: config.public.businessAddress,
                addressLocality: businessCity,
                addressCountry: 'TR'
            },
            geo: {
                '@type': 'GeoCoordinates',
                latitude: config.public.businessLatitude,
                longitude: config.public.businessLongitude
            },
            url: siteUrl,
            sameAs: [
                config.public.instagramUrl,
                config.public.facebookUrl
            ].filter(Boolean)
        }
    }

    /**
     * Get SEO meta tags from parsed content
     */
    function getSeoMeta(parsed: ParsedContent) {
        return {
            title: `${parsed.title} | ${businessName}`,
            description: parsed.description,
            keywords: parsed.keywords.join(', '),
            ogTitle: parsed.title,
            ogDescription: parsed.description,
            ogType: parsed.isProduct ? 'product' : 'article'
        }
    }

    /**
     * Get breadcrumb items from categories
     */
    function getBreadcrumbs(parsed: ParsedContent, currentPath: string): object {
        const items = [
            { name: 'Ana Sayfa', item: siteUrl },
            ...parsed.categories.slice(0, 2).map((cat, i) => ({
                name: cat.charAt(0).toUpperCase() + cat.slice(1),
                item: `${siteUrl}/kategori/${cat.toLowerCase()}`
            })),
            { name: parsed.title.slice(0, 30), item: `${siteUrl}${currentPath}` }
        ]

        return {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: items.map((item, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: item.name,
                item: item.item
            }))
        }
    }

    return {
        generateSchema,
        getSeoMeta,
        getBreadcrumbs,
        generateLocalBusinessSchema
    }
}
