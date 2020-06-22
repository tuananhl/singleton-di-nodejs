import { Request, Response } from "express";

export function raiseException<T>(request: Request, response: Response, code: number, message: string, data: T = null): any {
    let responseData: { code: number, message: string, data?: T } = {
        code,
        message
    };
    if (data) {
        responseData = { ...responseData, data };
    }
    return response.status(code).json(responseData);
}

export function responseServer<T>(request: Request, response: Response, code: number, message: string, data: T = null): any {
    let responseData: { code: number, message: string, data?: T } = {
        code,
        message
    };
    if (data) {
        responseData = { ...responseData, data };
    }
    return response.status(code).json(responseData);
}
