import { AppError } from './AppError'

export class ProcessingError extends AppError {
    public readonly step?: string

    constructor(message: string, step?: string) {
        super(message, 500)
        this.step = step

        Object.setPrototypeOf(this, ProcessingError.prototype)
    }
}
