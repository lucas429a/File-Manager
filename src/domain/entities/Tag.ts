export interface TagProps {
    id?: string
    orderNumber: string
    companyId: number
    tagType: string
    description?: string | null
    quantity?: number | null
    size?: string | null
    color?: string | null
    price?: string | null
    ean?: string | null
    subsegment?: string | null
    item?: string | null
    grade?: string | null
    volume?: string | null
    billingCenter?: string | null
    totalQuantity?: string | null
    supplier?: string | null
    data?: Record<string, any>
    createdAt?: Date
    updatedAt?: Date
}

export class Tag {
    private readonly props: TagProps

    private constructor(props: TagProps) {
        this.props = props
    }

    public static create(props: TagProps): Tag {
        if (!props.orderNumber) {
            throw new Error('Order number is required')
        }

        if (!props.companyId) {
            throw new Error('Company ID is required')
        }

        if (!props.tagType) {
            throw new Error('Tag type is required')
        }

        return new Tag({
            ...props,
            createdAt: props.createdAt || new Date(),
            updatedAt: props.updatedAt || new Date(),
        })
    }

    public static restore(props: TagProps): Tag {
        return new Tag(props)
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

    get tagType(): string {
        return this.props.tagType
    }

    get description(): string | null | undefined {
        return this.props.description
    }

    get quantity(): number | null | undefined {
        return this.props.quantity
    }

    get size(): string | null | undefined {
        return this.props.size
    }

    get color(): string | null | undefined {
        return this.props.color
    }

    get price(): string | null | undefined {
        return this.props.price
    }

    get ean(): string | null | undefined {
        return this.props.ean
    }

    get subsegment(): string | null | undefined {
        return this.props.subsegment
    }

    get item(): string | null | undefined {
        return this.props.item
    }

    get grade(): string | null | undefined {
        return this.props.grade
    }

    get volume(): string | null | undefined {
        return this.props.volume
    }

    get billingCenter(): string | null | undefined {
        return this.props.billingCenter
    }

    get totalQuantity(): string | null | undefined {
        return this.props.totalQuantity
    }

    get supplier(): string | null | undefined {
        return this.props.supplier
    }

    get data(): Record<string, any> | undefined {
        return this.props.data
    }

    get createdAt(): Date | undefined {
        return this.props.createdAt
    }

    get updatedAt(): Date | undefined {
        return this.props.updatedAt
    }

    public toObject(): TagProps {
        return { ...this.props }
    }

    public updateQuantity(quantity: number): void {
        this.props.quantity = quantity
        this.props.updatedAt = new Date()
    }

    public updateDescription(description: string): void {
        this.props.description = description
        this.props.updatedAt = new Date()
    }
}
