export interface CeAPriceData {
    N_PEDIDO: string
    CODIGO_MASTER: string
    CODIGO_DIGITO: string
    UC: string
    GRADE: string
    GRADE_QTD: string
    VOLUME: string
    N_TAMANHO: string
    SEMANA: string
    DESCRICAO: string
    FAIXA: string
    ITEM: string
    PRECO_VDA: string
    CICLOVIDA: string
    SUBSEGMENTO: string
    TOTAL: string
    ANO: string
    QTD: string
    EAN: string
    DES_AUXILIAR_1: string
    DES_AUXILIAR_2: string
}

export class CeAPriceConverter {
    private codeCounter: Map<string, number> = new Map()
    private codeOccurrences: Map<string, number> = new Map()

    parse({ fixedWidthData }: { fixedWidthData: string }): CeAPriceData[] {
        const lines = fixedWidthData.split('\n').filter(line => line.startsWith('D'))
        this.countCodeOccurrences(lines)
        return lines.map(line => this.parseLine(line)).filter(Boolean) as CeAPriceData[]
    }

    private countCodeOccurrences(lines: string[]): void {
        const tempCounter: Map<string, Map<string, number>> = new Map()

        lines.forEach(line => {
            if (line.length < 260) return

            const nPedido = line.substring(1, 7).trim()
            const codeXYZ = line.substring(58, 61).trim()
            const key = `${nPedido}_${codeXYZ}`

            if (!tempCounter.has(nPedido)) {
                tempCounter.set(nPedido, new Map())
            }

            const pedidoCounter = tempCounter.get(nPedido)!
            pedidoCounter.set(codeXYZ, (pedidoCounter.get(codeXYZ) || 0) + 1)
        })

        tempCounter.forEach((codes, pedido) => {
            codes.forEach((count, code) => {
                const key = `${pedido}_${code}`
                this.codeOccurrences.set(key, count)
            })
        })
    }

    private parseLine(line: string): CeAPriceData | null {
        const orderNumber = line.substring(1, 7)
        const codeXYZ = line.substring(58, 61)
        const key = `${orderNumber.trim()}_${codeXYZ.trim()}`

        const y = parseInt(codeXYZ.charAt(1), 10)
        const z = parseInt(codeXYZ.charAt(2), 10)

        const { desAux1, desAux2 } = this.getAuxiliarCodes(key, y, z)

        return {
            N_PEDIDO: orderNumber.trim(),
            CODIGO_MASTER: line.substring(7, 10),
            CODIGO_DIGITO: line.substring(10, 12),
            UC: line.substring(12, 19),
            GRADE: line.substring(33, 39),
            GRADE_QTD: line.substring(39, 42),
            VOLUME: line.substring(42, 43),
            N_TAMANHO: line.substring(43, 45),
            SEMANA: line.substring(62, 66),
            DESCRICAO: line.substring(66, 106),
            FAIXA: line.substring(106, 170),
            ITEM: line.substring(206, 210),
            PRECO_VDA: line.substring(213, 219),
            CICLOVIDA: line.substring(219, 220),
            SUBSEGMENTO: line.substring(219, 226),
            TOTAL: line.substring(231, 233),
            ANO: line.substring(233, 235),
            QTD: line.substring(238, 242),
            EAN: line.substring(248, 256),
            DES_AUXILIAR_1: desAux1,
            DES_AUXILIAR_2: desAux2,
        }
    }

    private getAuxiliarCodes(key: string, y: number, z: number): { desAux1: string; desAux2: string } {
        const occurrences = this.codeOccurrences.get(key) || 1

        if (occurrences > 1) {
            const currentCount = (this.codeCounter.get(key) || 0) + 1
            this.codeCounter.set(key, currentCount)

            return {
                desAux1: currentCount.toString(),
                desAux2: y.toString(),
            }
        }
        const sum = y + z
        const desAuxiliar1 = sum >= 10 ? '0' : sum.toString()

        return {
            desAux1: desAuxiliar1,
            desAux2: y.toString(),
        }
    }
}
