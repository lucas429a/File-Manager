export interface HumanitarianTagData {
    EAN: string
    N_PEDIDO: string
    FORNECEDOR: string
    DESCRICAO: string
    COR: string
    QTD: string
    N_TAMANHO: string
}

type Input = {
    csvData: string
}

export class HumanitarianConverter {
    parse({ csvData }: Input): HumanitarianTagData[] {
        const lines = csvData
            .trim()
            .split('\n')
            .filter(line => line.trim())

        const converted = lines.map(line => {
            const fields = line.split(';').map(field => field.trim())

            const qtdOriginal = Number(fields[5])
            const qtdDuplicada = qtdOriginal * 2

            return {
                EAN: fields[0],
                N_PEDIDO: fields[1],
                FORNECEDOR: fields[2],
                DESCRICAO: fields[3],
                COR: fields[4],
                QTD: qtdDuplicada.toString(),
                N_TAMANHO: fields[6],
            }
        })

        return converted
    }
}
