export interface ResponseHandler {
    statusCode: number;
    message: string;
    data: any | null;
}

export const createResponse = (statusCode: number, message: string, data: any | null = null): ResponseHandler => {
    return {
        statusCode,
        message,
        data,
    };
};
