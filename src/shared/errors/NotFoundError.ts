import { AppError } from './AppError'

export class NotFoundError extends AppError {
    constructor(resource: string, identifier?: string | number) {
        const message = identifier
            ? `${resource} with identifier '${identifier}' not found`
            : `${resource} not found`
        super(message, 404)

        Object.setPrototypeOf(this, NotFoundError.prototype)
    }
}
