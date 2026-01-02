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

export function pointToComa(s: string): string {
    return s.replace(/\./g, ',')
}

// Alias for backwards compatibility (original had typo)
export const ponintForComa = pointToComa

export function trimAndUpperCase(s: string): string {
    return s.trim().toUpperCase()
}

export function sanitizeString(s: string): string {
    return s.replace(/[^\w\s-]/g, '').trim()
}
