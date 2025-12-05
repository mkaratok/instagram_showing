// server/routes/sitemap.xml.ts
export default defineCachedEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const siteUrl = config.public.siteUrl || 'https://arzuozen.com'
    const accessToken = await getActiveToken()

    // Static Routes
    const routes = [
        '/',
        '/profile',
        // '/contact' // If exists
    ]

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`

    // Add Static Routes
    routes.forEach(route => {
        sitemap += `
  <url>
    <loc>${siteUrl}${route}</loc>
    <changefreq>daily</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`
    })

    // Fetch Instagram Posts for Dynamic Routes
    try {
        const baseUrl = 'https://graph.instagram.com/me/media'
        // Fetch enough fields to know it's a valid post
        const response = await $fetch<{ data: any[] }>(`${baseUrl}?fields=id,timestamp&limit=1000&access_token=${accessToken}`)

        if (response?.data) {
            response.data.forEach(post => {
                sitemap += `
  <url>
    <loc>${siteUrl}/posts/${post.id}</loc>
    <lastmod>${new Date(post.timestamp).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`
            })
        }
    } catch (error) {
        console.error('Sitemap Generation Error:', error)
    }

    sitemap += `
</urlset>`

    setHeader(event, 'Content-Type', 'application/xml')
    return sitemap
}, {
    maxAge: 60 * 60, // Cache for 1 hour
    name: 'sitemap-xml'
})
