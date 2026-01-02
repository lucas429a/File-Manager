export class CompanyName {
    private readonly value: string

    private constructor(value: string) {
        this.value = value.trim().toUpperCase()
    }

    public static create(value: string): CompanyName {
        if (!value) {
            throw new Error('Company name is required')
        }

        const trimmedValue = value.trim()

        if (trimmedValue.length < 2) {
            throw new Error('Company name must have at least 2 characters')
        }

        return new CompanyName(trimmedValue)
    }

    public getValue(): string {
        return this.value
    }

    public equals(other: CompanyName): boolean {
        return this.value === other.getValue()
    }

    public toString(): string {
        return this.value
    }
}
