import { AppError } from './AppError'

export class ConversionError extends AppError {
    public readonly sourceFormat?: string
    public readonly targetFormat?: string

    constructor(message: string, sourceFormat?: string, targetFormat?: string) {
        super(message, 422)
        this.sourceFormat = sourceFormat
        this.targetFormat = targetFormat

        Object.setPrototypeOf(this, ConversionError.prototype)
    }
}
