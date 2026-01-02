import { AppError } from './AppError'

export class ValidationError extends AppError {
    public readonly errors: string[]

    constructor(message: string, errors: string[] = []) {
        super(message, 400)
        this.errors = errors

        Object.setPrototypeOf(this, ValidationError.prototype)
    }
}
