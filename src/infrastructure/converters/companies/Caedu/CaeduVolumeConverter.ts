export type CaeduVolumeData = {
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
    VOLUME: string
}

type Input = {
    csvData: string
}


export class CaeduVolumeConverter {
    public parse(input: Input): CaeduVolumeData[] {
        try {
            const lines = input.csvData
                .split('\n')
                .map(line => line.trim())
                .filter(line => line)

            if (lines.length === 0) {
                throw new Error('Invalid format to volume Caedu.')
            }

            const sizes: Set<string> = new Set()
            const railings: string[] = []
            let baseRecord: any = null
            let totalQtd = 0

            for (const line of lines) {
                const values = line.split(',').map(v => v.trim())

                if (!baseRecord) {
                    baseRecord = {
                        FAIXA: values[0] || '',
                        FORNECEDOR: values[1] || '',
                        N_PEDIDO: values[2] || '',
                        UC: values[3] || '',
                        PRECO_VDA: values[4] || '',
                        GRADE_QTD: values[6] || '',
                        COR: values[7] || '',
                        DESCRICAO: values[9] || '',
                        CODIGO_MATERIAL_SKU: values[10] || '',
                        DEPARTAMENTO: values[11] || '',
                        ITEM: values[12] || '',
                        CICLOVIDA: values[13] || '',
                        SUBSEGMENTO: values[14] || '',
                        COD_DCO: values[15] || '',
                        CENTRO_FATURAMENTO: values[16] || '',
                    }
                    totalQtd = parseInt(values[17]) || 0
                }

                const railingValue = parseInt(values[5]) || 0
                if (railingValue > 0) {
                    sizes.add(values[8] || '')
                }

                if (railingValue > 0 && values[10].endsWith('D')) {
                    railings.push(values[5] || '')
                }
            }

            const sizesArray = Array.from(sizes).filter(t => t)
            const railingsArray = railings

            const allEntries: CaeduVolumeData[] = []

            for (let i = 1; i <= totalQtd; i++) {
                const formattedVolume = String(i).padStart(3, '0') + '/' + String(totalQtd).padStart(3, '0')

                allEntries.push({
                    FAIXA: baseRecord.FAIXA,
                    FORNECEDOR: baseRecord.FORNECEDOR,
                    N_PEDIDO: baseRecord.N_PEDIDO,
                    UC: baseRecord.UC,
                    PRECO_VDA: baseRecord.PRECO_VDA,
                    QTD: '1',
                    GRADE_QTD: railingsArray.join(' '),
                    COR: baseRecord.COR,
                    N_TAMANHO: baseRecord.N_TAMANHO,
                    DESCRICAO: baseRecord.DESCRICAO,
                    CODIGO_MATERIAL_SKU: baseRecord.CODIGO_MATERIAL_SKU,
                    DEPARTAMENTO: baseRecord.DEPARTAMENTO,
                    ITEM: baseRecord.ITEM,
                    CICLOVIDA: baseRecord.CICLOVIDA,
                    SUBSEGMENTO: baseRecord.SUBSEGMENTO,
                    COD_DCO: baseRecord.COD_DCO,
                    CENTRO_FATURAMENTO: baseRecord.CENTRO_FATURAMENTO,
                    GRADE: sizesArray.join('  '),
                    VOLUME: formattedVolume,
                })
            }

            return allEntries
        } catch (error) {
            throw new Error('Error converting Caedu volume files: ' + (error as any).message)
        }
    }
}
