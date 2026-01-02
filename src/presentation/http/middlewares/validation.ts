import { Request, Response, NextFunction } from 'express'
import { ValidationError } from '../../../shared/errors/ValidationError'

export function validateCompanyCode(req: Request, res: Response, next: NextFunction): void {
    const companyCode = req.query.companyCode || req.body.companyCode

    if (!companyCode) {
        throw new ValidationError('Code company is necessary', ['companyCode is required'])
    }

    const code = Number(companyCode)
    if (isNaN(code)) {
        throw new ValidationError('Invalid company code', ['companyCode must be a number'])
    }

    next()
}

export function validateTagType(req: Request, res: Response, next: NextFunction): void {
    const tagType = req.query.tipoEtiqueta || req.body.tipoEtiqueta

    if (!tagType) {
        throw new ValidationError('Tag type is required', ['tagType is required'])
    }

    next()
}

export function validateOrderNumber(req: Request, res: Response, next: NextFunction): void {
    const orderNumber = req.query.orderNumber || req.body.orderNumber

    if (!orderNumber) {
        throw new ValidationError('Order number is required', ['orderNumber is required'])
    }

    next()
}
