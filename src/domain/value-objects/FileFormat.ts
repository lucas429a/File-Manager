export enum FileFormat {
    XML = 'xml',
    CSV = 'csv',
    ZPL = 'zpl',
    FIXED_WIDTH = 'fixed_width',
    TXT = 'txt',
}

export class FileFormatValue {
    private readonly value: FileFormat

    private constructor(value: FileFormat) {
        this.value = value
    }

    public static create(value: string): FileFormatValue {
        const normalizedValue = value.toLowerCase().trim()

        switch (normalizedValue) {
            case 'xml':
                return new FileFormatValue(FileFormat.XML)
            case 'csv':
                return new FileFormatValue(FileFormat.CSV)
            case 'zpl':
                return new FileFormatValue(FileFormat.ZPL)
            case 'fixed_width':
            case 'fixedwidth':
            case 'fixed':
                return new FileFormatValue(FileFormat.FIXED_WIDTH)
            case 'txt':
            case 'text':
                return new FileFormatValue(FileFormat.TXT)
            default:
                throw new Error(`Formato de arquivo não suportado: ${value}`)
        }
    }

    public static fromExtension(extension: string): FileFormatValue {
        const ext = extension.toLowerCase().replace('.', '')

        switch (ext) {
            case 'xml':
                return new FileFormatValue(FileFormat.XML)
            case 'csv':
                return new FileFormatValue(FileFormat.CSV)
            case 'zpl':
                return new FileFormatValue(FileFormat.ZPL)
            case 'txt':
                return new FileFormatValue(FileFormat.TXT)
            default:
                return new FileFormatValue(FileFormat.FIXED_WIDTH)
        }
    }

    public getValue(): FileFormat {
        return this.value
    }

    public equals(other: FileFormatValue): boolean {
        return this.value === other.getValue()
    }

    public toString(): string {
        return this.value
    }

    public isXML(): boolean {
        return this.value === FileFormat.XML
    }

    public isCSV(): boolean {
        return this.value === FileFormat.CSV
    }

    public isZPL(): boolean {
        return this.value === FileFormat.ZPL
    }

    public isFixedWidth(): boolean {
        return this.value === FileFormat.FIXED_WIDTH
    }

    public isTXT(): boolean {
        return this.value === FileFormat.TXT
    }
}
