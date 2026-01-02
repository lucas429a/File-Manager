export interface OrderDTO {
    id?: string
    orderNumber: string
    companyId: number
    status: string
    tagCount?: number
    createdAt?: Date
}

export interface OrderListOutputDTO {
    orders: string[]
}
