// server/api/refresh.ts
export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const newToken = query.token as string

    if (!newToken) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Token is required'
        })
    }

    await useStorage('data').setItem('ig_access_token', newToken)

    return {
        status: 'success',
        message: 'Token updated successfully'
    }
})
