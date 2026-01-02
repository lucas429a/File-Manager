export interface ProcessTagFileInputDTO {
    companyCode: number
    files: Express.Multer.File[]
}

export interface ProcessTagFileOutputDTO {
    success: boolean
    message: string
    orderNumber?: string
    tagCount?: number
    tagTypes?: string[]
    errors?: string[]
}
