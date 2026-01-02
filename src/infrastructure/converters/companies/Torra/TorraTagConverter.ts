export type TorraTagData = {
    DESCRICAO: string
    COD_DCO: string
    COD_BARRA: string
    SEMANA: string
    SUBSEGMENTO: string
    DEPARTAMENTO: string
    NOME_EMPRESA: string
    PRECO_VDA: string
    FORNECEDOR: string
    N_PEDIDO: string
    QTD: string
    CICLOVIDA: string
    CENTRO_FATURAMENTO: string
    COR: string
    N_TAMANHO: string
    QTD_TOTAL: string
}

type Input = {
    csvData: string
}

export class TorraTagConverter {
    public parse(input: Input): TorraTagData[] {
        const lines = input.csvData
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)

        const tags: TorraTagData[] = []

        for (const line of lines) {
            const fields = line.split(',')

            tags.push({
                DESCRICAO: fields[0]?.trim() || '',
                COD_DCO: fields[1]?.trim() || '',
                COD_BARRA: fields[2]?.trim() || '',
                SEMANA: fields[3]?.trim() || '',
                SUBSEGMENTO: fields[4]?.trim() || '',
                DEPARTAMENTO: fields[5]?.trim() || '',
                NOME_EMPRESA: fields[6]?.trim() || '',
                PRECO_VDA: fields[8]?.trim() || '',
                FORNECEDOR: fields[9]?.trim() || '',
                N_PEDIDO: fields[10]?.trim() || '',
                QTD: fields[11]?.trim() || '',
                CICLOVIDA: fields[12]?.trim() || '',
                CENTRO_FATURAMENTO: fields[14]?.trim() || '',
                COR: fields[15]?.trim() || '',
                N_TAMANHO: fields[16]?.trim() || '',
                QTD_TOTAL: fields[18]?.trim() || '',
            })
        }

        if (tags.length === 0) {
            throw new Error('Not found valid data for Torra tags.')
        }

        return tags
    }
}
