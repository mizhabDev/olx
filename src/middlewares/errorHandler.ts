
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const statusCode = res.statusCode ? res.statusCode : 500;


    switch (statusCode) {
        case 200:
            res.json({
                title: "Success",
                message: err.message,
                stackTrace: err.stack
            });
            break;

        case 201:
            res.json({
                title: "Created",
                message: err.message,
                stackTrace: err.stack
            });
            break;

        case 400:
            res.json({
                title: "Bad Request",
                message: err.message,
                stackTrace: err.stack
            });
            break;

        case 401:
            res.json({
                title: "Unauthorized",
                message: err.message,
                stackTrace: err.stack
            });
            break;


        case 403:
            res.json({
                title: "Forbidden",
                message: err.message,
                stackTrace: err.stack
            });
            break;

        case 404:
            res.json({
                title: "Page not found",
                message: err.message,
                stackTrace: err.stack
            });
            break;

        case 409:
            res.json({
                title: "Conflict",
                message: err.message,
                stackTrace: err.stack
            });
            break;

        case 500:
            res.json({
                title: "Internal Server Error",
                message: err.message,
                stackTrace: err.stack
            });
            break;

        case 503:
            res.json({
                title: "Service Unavailable",
                message: err.message,
                stackTrace: err.stack
            });
            break;

        default:
            res.json({ title: "Error", message: "An unknown error occurred" });
            break;
    }
}










