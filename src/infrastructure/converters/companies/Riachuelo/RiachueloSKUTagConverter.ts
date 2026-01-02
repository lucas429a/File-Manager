import { parseStringPromise } from 'xml2js'

export type RiachueloSKUTagData = {
    Cor: string
    CodDepto: string
    DescricaoMaterial: string
    Tamanho: string
    PedidoCodigo: string
    Grade: string
    QuantidadeEtiqueta: string
    Digito: string
}

type Input = {
    xmlData: string
}

export class RiachueloSKUTagConverter {
    public async parse(input: Input): Promise<RiachueloSKUTagData[]> {
        try {
            const result = await parseStringPromise(input.xmlData, {
                explicitArray: false,
                mergeAttrs: true,
            })

            if (!result.Preco || !result.Preco.PedidoRiac) {
                throw new Error('Invalid Riachuelo SKU file structure.')
            }

            const pedidoRiac = result.Preco.PedidoRiac
            const pedidoCodigo = pedidoRiac.Codigo || ''
            const items = Array.isArray(pedidoRiac.Item) ? pedidoRiac.Item : [pedidoRiac.Item]

            const allEntries: RiachueloSKUTagData[] = []

            for (const item of items) {
                const variants = Array.isArray(item.Variante) ? item.Variante : [item.Variante]

                for (const variant of variants) {
                    allEntries.push({
                        PedidoCodigo: pedidoCodigo,
                        Tamanho: variant.Tamanho?.toString() || '',
                        CodDepto: variant.CodDepto?.toString() || '',
                        Grade: variant.Codigo?.toString() || '',
                        DescricaoMaterial: variant.DescricaoMaterial?.toString() || '',
                        Cor: variant.Cor?.toString() || '',
                        QuantidadeEtiqueta: variant.QuantidadeEtiqueta?.toString() || '',
                        Digito: variant.Digito?.toString() || '',
                    })
                }
            }

            return allEntries
        } catch (error: any) {
            throw new Error('Error converting Riachuelo SKU file.')
        }
    }
}
