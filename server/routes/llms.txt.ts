// server/routes/llms.txt.ts
// Dynamic llms.txt endpoint for AI bots - provides site summary in Markdown format
// This is the new standard for AI bot communication (like robots.txt but for LLMs)

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const publicConfig = config.public

    const siteUrl = publicConfig.siteUrl || 'https://arzuozen.com'
    const businessName = publicConfig.businessName || 'arzuozen'
    const businessType = publicConfig.businessType || 'PRODUCT'
    const businessProfession = publicConfig.businessProfession || 'Moda & Giyim'
    const businessPhone = publicConfig.businessPhone || ''
    const businessAddress = publicConfig.businessAddress || ''
    const businessCity = publicConfig.businessCity || ''
    const instagramUrl = publicConfig.instagramUrl || ''

    // Determine business description based on type
    const businessDescriptions: Record<string, string> = {
        'PRODUCT': `${businessName}, ${businessProfession} alanında faaliyet gösteren bir e-ticaret işletmesidir. Instagram üzerinden ürün satışı yapmaktadır.`,
        'SERVICE': `${businessName}, ${businessProfession} alanında profesyonel hizmetler sunan bir işletmedir.`,
        'RESTAURANT': `${businessName}, ${businessCity} ilinde hizmet veren bir restoran/kafe işletmesidir.`,
        'LOCAL_BUSINESS': `${businessName}, ${businessCity} ilinde faaliyet gösteren yerel bir işletmedir.`
    }

    const description = businessDescriptions[businessType] || businessDescriptions['LOCAL_BUSINESS']

    // Build the llms.txt content in Markdown format
    const content = `# ${businessName}

## Hakkında
${description}

## İletişim Bilgileri
${businessPhone ? `- **Telefon**: ${businessPhone}` : ''}
${businessAddress ? `- **Adres**: ${businessAddress}` : ''}
${businessCity ? `- **Şehir**: ${businessCity}` : ''}

## Sosyal Medya
${instagramUrl ? `- **Instagram**: ${instagramUrl}` : ''}

## Site Haritası ve Önemli Linkler
- **Ana Sayfa**: ${siteUrl}/
- **Site Haritası (XML)**: ${siteUrl}/sitemap.xml
- **Ürün/Hizmet Galerisi**: ${siteUrl}/#posts
- **İletişim**: ${siteUrl}/#contact

## Bu Site Hakkında
Bu web sitesi, ${businessName} markasının Instagram içeriklerini sergileyen bir vitrin sitesidir. 
Tüm ürün ve hizmet bilgileri Instagram paylaşımlarından alınmaktadır.

## AI Asistanlar İçin Notlar
- Bu site Türkçe içerik sunmaktadır.
- Ürün/hizmet fiyatları Instagram paylaşımlarında belirtilmektedir.
- Sipariş ve randevu için Instagram DM veya WhatsApp kullanılabilir.
- Site içeriği düzenli olarak Instagram API üzerinden güncellenmektedir.

## Lisans
Tüm içerik hakları ${businessName} markasına aittir.
`

    // Set proper content type for plain text/markdown
    setResponseHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
    setResponseHeader(event, 'Cache-Control', 'public, max-age=86400') // Cache for 24 hours

    return content
})
