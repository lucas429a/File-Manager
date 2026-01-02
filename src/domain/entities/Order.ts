export type OrderStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface OrderProps {
    id?: string
    orderNumber: string
    companyId: number
    status: OrderStatus
    tagCount?: number
    processedAt?: Date | null
    createdAt?: Date
    updatedAt?: Date
}

export class Order {
    private readonly props: OrderProps

    private constructor(props: OrderProps) {
        this.props = props
    }

    public static create(props: Omit<OrderProps, 'status'> & { status?: OrderStatus }): Order {
        if (!props.orderNumber) {
            throw new Error('Order number is required')
        }

        if (!props.companyId) {
            throw new Error('Company ID is required')
        }

        return new Order({
            ...props,
            status: props.status || 'pending',
            tagCount: props.tagCount || 0,
            createdAt: props.createdAt || new Date(),
            updatedAt: props.updatedAt || new Date(),
        })
    }

    public static restore(props: OrderProps): Order {
        return new Order(props)
    }

    get id(): string | undefined {
        return this.props.id
    }

    get orderNumber(): string {
        return this.props.orderNumber
    }

    get companyId(): number {
        return this.props.companyId
    }

    get status(): OrderStatus {
        return this.props.status
    }

    get tagCount(): number {
        return this.props.tagCount || 0
    }

    get processedAt(): Date | null | undefined {
        return this.props.processedAt
    }

    get createdAt(): Date | undefined {
        return this.props.createdAt
    }

    get updatedAt(): Date | undefined {
        return this.props.updatedAt
    }

    public toObject(): OrderProps {
        return { ...this.props }
    }

    public markAsProcessing(): void {
        this.props.status = 'processing'
        this.props.updatedAt = new Date()
    }

    public markAsCompleted(): void {
        this.props.status = 'completed'
        this.props.processedAt = new Date()
        this.props.updatedAt = new Date()
    }

    public markAsFailed(): void {
        this.props.status = 'failed'
        this.props.updatedAt = new Date()
    }

    public updateTagCount(count: number): void {
        this.props.tagCount = count
        this.props.updatedAt = new Date()
    }

    public isPending(): boolean {
        return this.props.status === 'pending'
    }

    public isProcessing(): boolean {
        return this.props.status === 'processing'
    }

    public isCompleted(): boolean {
        return this.props.status === 'completed'
    }

    public isFailed(): boolean {
        return this.props.status === 'failed'
    }
}
