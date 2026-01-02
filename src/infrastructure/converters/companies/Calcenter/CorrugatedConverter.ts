export type CSVData = {
    QTD: string
    'N PEDIDO': string
    'CODIGO MASTER': string
    FORNECEDOR: string
    COR: string
    DESCRICAO: string
    UC: string
    GRADE: string
    'GRADE QTD': string
    TOTAL: string
    SEMANA: string
    EMPRESA: string
    VOLUME: string
    ANO: string
    PROMOCAO: string
    DEPARTAMENTO: string
    origem?: string
    orderHeader?: string
}

type Input = {
    csvData: string
}

export class CalcenterCorrugadoConverter {
    keyWord = 'CORRUGADO'
    private findStartline(input: Input) {
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

    public parse(input: Input): CSVData[] {
        const startLine = this.findStartline(input)
        if (startLine === -1) {
            throw new Error(`Keyword ${this.keyWord} not found in the file`)
        }

        const pedidoHeader = this.extractOrderNumber(input)

        const lines = input.csvData
            .split('\n')
            .map(line => line.trim())
            .filter(line => line)
            .slice(startLine)

        const headers = lines[0].split(';').map(h => h.trim())

        const filteredHeaders = headers.filter(header => header !== 'INICIO')

        let allEntries: CSVData[] = []

        lines.slice(1).forEach(line => {
            const values = line.split(';').map(v => v.trim())
            const entry: Partial<CSVData> = {}

            filteredHeaders.forEach((header, index) => {
                entry[header as keyof CSVData] = values[index] || ''
            })

            entry.origem = 'corrugado'
            entry.orderHeader = pedidoHeader

            allEntries.push(entry as CSVData)
        })

        return allEntries
    }
}
