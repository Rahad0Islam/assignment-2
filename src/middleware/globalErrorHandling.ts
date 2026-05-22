import type { NextFunction, Request, Response } from "express";

type AppError = Error & {
    statusCode?: number;
    errors?: unknown;
};

export const globalErrorHandler = (err: unknown, req: Request, res:Response, next:NextFunction) => {
    const error = err as AppError;
    const statusCode = typeof error?.statusCode === "number" ? error.statusCode : 500;
    const message = error instanceof Error ? error.message : "Internal Server Error";
    const errors = error?.errors;

    res.status(statusCode).json({
        success: false,
        message,
        errors
    });
};