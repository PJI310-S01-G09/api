
export const mountResponse = (data, error, message) => {
    return {
        message: error ? undefined : message,
        data: data || null,
        error: error || null,
    }
}
