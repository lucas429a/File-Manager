export class FileDetectorCeA {
    static detectFileType(content: string): 'price' | 'pack' | null {
        const lines = content.split('\n')
        const headerLine = lines.find(line => line.startsWith('H'))
        if (!headerLine) return null

        if (headerLine.includes('PRECO DE VENDA')) {
            return 'price'
        }
        if (headerLine.includes('PACK')) {
            return 'pack'
        }

        return null
    }
}
