export type CSVDataInsole = {
    QTD: string
    DESCRICAO?: string
    COR?: string
    'N TAMANHO'?: string
    'CODIGO MATERIAL SKU'?: string
    'CODIGO MASTER': string
    EAN?: string
    'CODIGO DIGITO'?: string
    origem?: string
    orderHeader?: string
}

type Input = {
    csvData: string
}

export class CalcenterInsoleConverter {
    keyWord = 'OCULTA CALCADO'
    private findStartLine(input: Input) {
        const lines = input.csvData.split('\n').map(line => line.trim())
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes(this.keyWord)) {
                return i + 1
            }
        }
        return -1
    }

    private extractOrderNumber(input: Input): string {
        const lines = input.csvData.split('\n')
        for (const line of lines) {
            if (line.includes('PEDIDO')) {
                const match = line.match(/PEDIDO\s+(\d+)/)
                if (match && match[1]) {
                    return match[1]
                }
            }
        }
        return ''
    }

    public parse(input: Input) {
        const startLine = this.findStartLine(input)
        if (startLine === -1) {
            throw new Error(`Keyword ${this.keyWord} not found in the file`)
        }

        const orderHeader = this.extractOrderNumber(input)

        const lines = input.csvData
            .split('\n')
            .map(line => line.trim())
            .filter(line => line)
            .slice(startLine)

        const headers = lines[0].split(';').map(h => h.trim())

        const allEntries: CSVDataInsole[] = []

        lines.slice(1).forEach(line => {
            const values = line.split(';').map(v => v.trim())
            const entry: Partial<CSVDataInsole> = {}

            headers.forEach((header, index) => {
                entry[header as keyof CSVDataInsole] = values[index] || ''
            })
            entry.origem = 'palmilha'
            entry.orderHeader = orderHeader

            allEntries.push(entry as CSVDataInsole)
        })

        return allEntries
    }
}
