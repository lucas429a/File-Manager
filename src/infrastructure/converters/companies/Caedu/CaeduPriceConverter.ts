export type CaeduPriceData = {
    FAIXA: string
    FORNECEDOR: string
    N_PEDIDO: string
    UC: string
    PRECO_VDA: string
    QTD: string
    GRADE_QTD: string
    COR: string
    N_TAMANHO: string
    DESCRICAO: string
    CODIGO_MATERIAL_SKU: string
    DEPARTAMENTO: string
    ITEM: string
    CICLOVIDA: string
    SUBSEGMENTO: string
    COD_DCO: string
    CENTRO_FATURAMENTO: string
    GRADE: string
    tipoEtiqueta?: string
}

type Input = {
    csvData: string
}

export class CaeduPriceConverter {
    public parse(input: Input): CaeduPriceData[] {
        try {
            const lines = input.csvData
                .split('\n')
                .map(line => line.trim())
                .filter(line => line)

            if (lines.length === 0) {
                throw new Error('Invalid format to price Caedu.')
            }

            const allEntries: CaeduPriceData[] = []

            for (const line of lines) {
                const values = line.split(',').map(v => v.trim())

                const priceVda = values[4]
                const tagTipe = priceVda && priceVda !== '' ? 'caeduprice' : 'caedunoprice'

                allEntries.push({
                    FAIXA: values[0] || '',
                    FORNECEDOR: values[1] || '',
                    N_PEDIDO: values[2] || '',
                    UC: values[3] || '',
                    PRECO_VDA: priceVda || '',
                    GRADE: values[5] || '',
                    GRADE_QTD: values[6] || '',
                    COR: values[7] || '',
                    N_TAMANHO: values[8] || '',
                    DESCRICAO: values[9] || '',
                    CODIGO_MATERIAL_SKU: values[10] || '',
                    DEPARTAMENTO: values[11] || '',
                    ITEM: values[12] || '',
                    CICLOVIDA: values[13] || '',
                    SUBSEGMENTO: values[14] || '',
                    COD_DCO: values[15] || '',
                    CENTRO_FATURAMENTO: values[16] || '',
                    QTD: values[17] || '',
                    tipoEtiqueta: tagTipe,
                })
            }

            return allEntries
        } catch (error) {
            throw new Error('Error converting Caedu price files: ' + (error as Error).message)
        }
    }
}
