export function onlyDigits(value: number | string): string {
    return String(value).replace(/\D/g, '')
}
