// server/api/refresh.ts
// DEPRECATED: This endpoint is no longer used.
// All tokens are now managed via .env file and Runtime Config.
// To update tokens, modify the .env file and restart the application.

export default defineEventHandler(async (event) => {
    throw createError({
        statusCode: 410,
        statusMessage: 'This endpoint is deprecated. Update tokens in .env file instead.'
    })
})
