import { Request, Response, NextFunction } from 'express'
import { AppError } from '../../../shared/errors/AppError'

export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    console.error('Erro:', err)

    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            success: false,
            error: err.message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
        })
        return
    }

    // Erro genérico
    res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && {
            message: err.message,
            stack: err.stack,
        }),
    })
}
