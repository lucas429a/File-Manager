export interface TagDTO {
    id?: string
    orderNumber: string
    companyId: number
    tagType: string
    description?: string | null
    quantity?: number | null
    size?: string | null
    color?: string | null
    price?: string | null
}

export interface TagListInputDTO {
    companyCode: number
    orderNumber?: string
    tagType?: string
    color?: string
    model?: string
}

export interface TagListOutputDTO {
    tags: TagDTO[]
}

export interface DeleteTagsInputDTO {
    orderNumber: string
    companyId: number
}

export interface DeleteTagsOutputDTO {
    success: boolean
    deletedCount: number
}
