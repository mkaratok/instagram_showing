// server/api/geo/enhance.post.ts
// API endpoint to enhance content with GEO processing
// Returns enhanced content with intent, FAQ, entities, and schema recommendation

import { enhanceContentForGeo } from '../../utils/geoContentEnhancer'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { caption } = body

    if (!caption || typeof caption !== 'string') {
        throw createError({
            statusCode: 400,
            message: 'caption is required'
        })
    }

    const enhanced = enhanceContentForGeo(caption)

    return {
        success: true,
        data: enhanced
    }
})
