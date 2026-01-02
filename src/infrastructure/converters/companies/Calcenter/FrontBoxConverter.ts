export type CSVDataFrontBox = {
    QTD: string
    COR: string
    'N TAMANHO': string
    'CODIGO DIGITO': string
    DESCRICAO: string
    EAN: string
    'CODIGO MATERIAL SKU': string
    'PRECO VDA': string
    'SEMANA ENTREGA': string
    FAIXA: string
    ANO: string
    PROMOCAO: string
    ITEM: string
    SUBSEGMENTO: string
    CICLOVIDA: string
    origem?: string
    orderHeader?: string
}

type Input = {
    csvData: string
}

export class CalcenterFrontBoxConverter {
    keyWord = 'FRENTE DE CAIXA DO CALCADO'
    private findSartLine(input: Input) {
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
        const startLine = this.findSartLine(input)
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

        let allentries: CSVDataFrontBox[] = []

        lines.slice(1).forEach(line => {
            const values = line.split(';').map(v => v.trim())
            const entry: Partial<CSVDataFrontBox> = {}

            headers.forEach((header, index) => {
                entry[header as keyof CSVDataFrontBox] = values[index] || ''
            })

            entry.origem = 'frontbox'
            entry.orderHeader = orderHeader

            allentries.push(entry as CSVDataFrontBox)
        })
        return allentries
    }
}
