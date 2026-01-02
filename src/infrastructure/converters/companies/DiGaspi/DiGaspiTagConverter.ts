export type DiGaspiTagData = {
    EAN: string
    Quantidade: string
    Preco: string
    Descricao: string
    Subsegmento: string
    Fornecedor: string
    Cor: string
    Tamanho: string
    Item: string
    UC: string
    N_PEDIDO: string
}

type Input = {
    csvData: string
    n_pedido: string
}

export class DiGaspiTagConverter {
    public parse(input: Input): DiGaspiTagData[] {
        const lines = input.csvData
            .split('\n')
            .map(line => line.trim())
            .filter(line => line)

        const allEntries: DiGaspiTagData[] = []

        for (const line of lines) {
            const values = line.split(';').map(v => v.trim())
            if (values.length < 11) continue

            allEntries.push({
                EAN: values[0],
                Quantidade: values[1],
                Preco: values[2],
                Descricao: values[3],
                Subsegmento: values[4],
                Fornecedor: values[5],
                Cor: values[6],
                Tamanho: values[7],
                Item: values[8],
                UC: values[10],
                N_PEDIDO: input.n_pedido,
            })
        }
        return allEntries
    }
}
