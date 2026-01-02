export class CNPJValue {
    private readonly value: string

    private constructor(value: string) {
        this.value = value
    }

    public static create(value: string): CNPJValue {
        if (!value) {
            throw new Error('CNPJ is required')
        }

        const cleanedValue = value.replace(/\D/g, '')

        if (cleanedValue.length !== 14) {
            throw new Error('CNPJ must have 14 digits')
        }

        return new CNPJValue(cleanedValue)
    }

    public static createWithoutValidation(value: string): CNPJValue {
        const cleanedValue = value.replace(/\D/g, '')
        return new CNPJValue(cleanedValue)
    }

    public getValue(): string {
        return this.value
    }

    public getFormatted(): string {
        return this.value.replace(
            /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
            '$1.$2.$3/$4-$5'
        )
    }

    public equals(other: CNPJValue): boolean {
        return this.value === other.getValue()
    }

    public toString(): string {
        return this.getFormatted()
    }
}
