export interface CeAPackData {
    N_PEDIDO: string
    DES_AUXILIAR_1: string
    DES_AUXILIAR_2: string
    CICLOVIDA: string
    SUBSEGMENTO: string
    CENTRO_FATURAMENTO: string
    CODIGO_DIGITO: string
    DESCRICAO: string
    ITEM: string
    QTD: string
    CODIGO_MASTER: string
}

export class CeAPackConverter {
    parse({ fixedWidthData }: { fixedWidthData: string }): CeAPackData[] {
        const lines = fixedWidthData.split('\n').filter(line => line.startsWith('D'))
        return lines.map(line => this.parseLine(line)).filter(Boolean) as CeAPackData[]
    }

    private parseLine(line: string): CeAPackData | null {
        if (line.length < 50) return null

        return {
            N_PEDIDO: line.substring(2, 8).trim(),
            CODIGO_MASTER: line.substring(1, 8).trim(),
            DES_AUXILIAR_1: line.substring(33, 36).trim(),
            DES_AUXILIAR_2: line.substring(36, 39).trim(),
            CICLOVIDA: line.substring(46, 48).trim(),
            ITEM: line.substring(108, 109).trim(),
            SUBSEGMENTO: line.substring(150, 153).trim(),
            CENTRO_FATURAMENTO: line.substring(46, 62).trim(),
            DESCRICAO: line.substring(101, 105).trim(),
            CODIGO_DIGITO: line.substring(260, 264).trim(),
            QTD: '1',
        }
    }
}
