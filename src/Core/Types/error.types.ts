export type errorType = {
    field: string
    message: string,
    error?: Error | string,
}

export type errorDto = {
    errorsMessages: errorType[]
}