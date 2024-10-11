export type ResponseData<T = any> = {
    success: boolean,
    message: string,
    data: T,
}