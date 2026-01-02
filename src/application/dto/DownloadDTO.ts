export interface DownloadInputDTO {
    companyCode: number
    tagType: string
    orderNumber?: string
    format?: string
}

export interface DownloadOutputDTO {
    success: boolean
    buffer?: Buffer
    fileName?: string
    contentType?: string
    error?: string
}
