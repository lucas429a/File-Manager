export function removeLeadingZeros(s: string): string {
    if (typeof s !== 'string') s = String(s ?? '')
    const removed = s.replace(/^0+/, '')
    return removed === '' ? '0' : removed
}

export function lastTwoChars(s: string, padWithZero = false): string {
    if (typeof s !== 'string') s = String(s ?? '')
    if (s.length >= 2) return s.slice(-2)
    return padWithZero ? s.padStart(2, '0') : s
}

export function ponintForComa(s: string): string {
    return s.replace(/\./g, ',')
}
