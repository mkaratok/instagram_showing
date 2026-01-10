// server/routes/sitemap-images.xml.ts
export default defineCachedEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const siteUrl = config.public.siteUrl || 'https://arzuozen.com'
    const accessToken = await getActiveToken()

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`

    try {
        const baseUrl = 'https://graph.instagram.com/me/media'
        // Fetch media_url, caption, thumbnail_url
        const response = await $fetch<{ data: any[] }>(`${baseUrl}?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=1000&access_token=${accessToken}`)

        if (response?.data) {
            response.data.forEach(post => {
                const imageUrl = post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url
                const caption = post.caption ? post.caption.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;') : ''

                if (imageUrl) {
                    sitemap += `
  <url>
    <loc>${siteUrl}/posts/${post.id}</loc>
    <image:image>
      <image:loc>${imageUrl}</image:loc>
      ${caption ? `<image:title>${caption.slice(0, 100)}...</image:title>` : ''}
    </image:image>
  </url>`
                }
            })
        }
    } catch (error) {
        console.error('Image Sitemap Generation Error:', error)
    }

    sitemap += `
</urlset>`

    setHeader(event, 'Content-Type', 'application/xml')
    return sitemap
}, {
    maxAge: 60 * 60, // Cache for 1 hour
    name: 'sitemap-images-xml'
})
