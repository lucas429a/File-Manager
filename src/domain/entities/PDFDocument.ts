export interface PDFDocumentProps {
    id?: string
    fileName: string
    companyId: number
    tagType: string
    orderNumber?: string
    buffer?: Buffer
    filePath?: string
    pageCount?: number
    tagCount?: number
    generatedAt?: Date
    createdAt?: Date
}

export class PDFDocument {
    private readonly props: PDFDocumentProps

    private constructor(props: PDFDocumentProps) {
        this.props = props
    }

    public static create(props: PDFDocumentProps): PDFDocument {
        if (!props.fileName) {
            throw new Error('Name of the file is required')
        }

        if (!props.companyId) {
            throw new Error('Company ID is required')
        }

        if (!props.tagType) {
            throw new Error('Tag type is required')
        }

        return new PDFDocument({
            ...props,
            generatedAt: props.generatedAt || new Date(),
            createdAt: props.createdAt || new Date(),
        })
    }

    public static restore(props: PDFDocumentProps): PDFDocument {
        return new PDFDocument(props)
    }

    get id(): string | undefined {
        return this.props.id
    }

    get fileName(): string {
        return this.props.fileName
    }

    get companyId(): number {
        return this.props.companyId
    }

    get tagType(): string {
        return this.props.tagType
    }

    get orderNumber(): string | undefined {
        return this.props.orderNumber
    }

    get buffer(): Buffer | undefined {
        return this.props.buffer
    }

    get filePath(): string | undefined {
        return this.props.filePath
    }

    get pageCount(): number | undefined {
        return this.props.pageCount
    }

    get tagCount(): number | undefined {
        return this.props.tagCount
    }

    get generatedAt(): Date | undefined {
        return this.props.generatedAt
    }

    get createdAt(): Date | undefined {
        return this.props.createdAt
    }

    public toObject(): PDFDocumentProps {
        return { ...this.props }
    }

    public setBuffer(buffer: Buffer): void {
        this.props.buffer = buffer
    }

    public setFilePath(filePath: string): void {
        this.props.filePath = filePath
    }

    public setPageCount(count: number): void {
        this.props.pageCount = count
    }

    public setTagCount(count: number): void {
        this.props.tagCount = count
    }

    public hasBuffer(): boolean {
        return !!this.props.buffer
    }

    public hasFilePath(): boolean {
        return !!this.props.filePath
    }
}
