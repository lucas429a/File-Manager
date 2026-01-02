export interface GeneratePDFInputDTO {
    companyCode: number
    tagType: string
    orderNumber?: string
    quantity?: number
    sizesWithQuantities?: Array<{ id: string; quantity: number }>
}

export interface GeneratePDFOutputDTO {
    success: boolean
    buffer?: Buffer
    fileName?: string
    error?: string
}
