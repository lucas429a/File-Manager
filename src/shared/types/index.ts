
export interface PaginationParams {
    page?: number
    limit?: number
    offset?: number
}

export interface PaginatedResult<T> {
    data: T[]
    total: number
    page: number
    limit: number
    totalPages: number
}

export interface ApiResponse<T = any> {
    success: boolean
    data?: T
    message?: string
    error?: string
    errors?: string[]
}

export interface FileInfo {
    originalname: string
    filename: string
    mimetype: string
    size: number
    path: string
}

export type SupportedFileFormat = 'csv' | 'xml' | 'zpl' | 'txt' | 'fixed_width'

export interface TagGenerationOptions {
    quantity?: number
    sizesWithQuantities?: Array<{ id: string; quantity: number }>
}

export interface CompanyInfo {
    id: number
    name: string
    alias?: string
    code: number
}


export type { Request, Response, NextFunction } from 'express'
