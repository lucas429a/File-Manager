export function onlyDigits(value: number | string): string {
    return String(value).replace(/\D/g, '')
}

export function formatPrice(value: number | string): string {
    const numValue = typeof value === 'string' ? parseFloat(value) : value
    return numValue.toFixed(2).replace('.', ',')
}

export function parseNumber(value: string): number {
    return parseFloat(value.replace(',', '.'))
}
