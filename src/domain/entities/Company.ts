export interface CompanyProps {
    id: number
    name: string
    alias?: string | null
    tagTypes?: string[]
    createdAt?: Date
    updatedAt?: Date
}

export class Company {
    private readonly props: CompanyProps

    private constructor(props: CompanyProps) {
        this.props = props
    }

    public static create(props: CompanyProps): Company {
        if (!props.id) {
            throw new Error('Company ID is required')
        }

        if (!props.name) {
            throw new Error('Company name is required')
        }

        return new Company({
            ...props,
            tagTypes: props.tagTypes || [],
            createdAt: props.createdAt || new Date(),
            updatedAt: props.updatedAt || new Date(),
        })
    }

    public static restore(props: CompanyProps): Company {
        return new Company(props)
    }

    get id(): number {
        return this.props.id
    }

    get name(): string {
        return this.props.name
    }

    get alias(): string | null | undefined {
        return this.props.alias
    }

    get tagTypes(): string[] {
        return this.props.tagTypes || []
    }

    get createdAt(): Date | undefined {
        return this.props.createdAt
    }

    get updatedAt(): Date | undefined {
        return this.props.updatedAt
    }

    public toObject(): CompanyProps {
        return { ...this.props }
    }

    public addTagType(tagType: string): void {
        if (!this.props.tagTypes) {
            this.props.tagTypes = []
        }

        if (!this.props.tagTypes.includes(tagType)) {
            this.props.tagTypes.push(tagType)
            this.props.updatedAt = new Date()
        }
    }

    public hasTagType(tagType: string): boolean {
        return this.props.tagTypes?.includes(tagType) || false
    }
}
