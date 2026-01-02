export class OrderNumber {
    private readonly value: string

    private constructor(value: string) {
        this.value = value.trim()
    }

    public static create(value: string): OrderNumber {
        if (!value) {
            throw new Error('Order number is required')
        }

        const trimmedValue = value.trim()

        if (trimmedValue.length === 0) {
            throw new Error('Order number cannot be empty')
        }

        return new OrderNumber(trimmedValue)
    }

    public getValue(): string {
        return this.value
    }

    public equals(other: OrderNumber): boolean {
        return this.value === other.getValue()
    }

    public toString(): string {
        return this.value
    }
}
