import { parseStringPromise } from 'xml2js'
import fs from 'fs'

export type RiachueloTagPriceData = {
    PedidoCodigo: string
    Tamanho: string
    CodDepto: string
    DataEntrega: string
    CodigoBureau: string
    Grade: string
    DescricaoMaterial: string
    Cor: string
    Estacao: string
    EstrColecao: string
    PrecoMaterial: string
    QuantidadeEtiqueta: string
    Digito: string
    MaterialForn: string
}

type Input = {
    xmlData: string
}

export class RiachueloPriceTagConverter {
    public async parse(input: Input): Promise<RiachueloTagPriceData[]> {
        try {
            const result = await parseStringPromise(input.xmlData, {
                explicitArray: false,
                mergeAttrs: true,
            })
            if (!result.Preco || !result.Preco.PedidoRiac) {
                throw new Error('invalid Riachuelo price file structure.')
            }
            const pedidoRiac = result.Preco.PedidoRiac
            const pedidoCodigo = pedidoRiac.Codigo || ''
            const items = Array.isArray(pedidoRiac.Item) ? pedidoRiac.Item : [pedidoRiac.Item]

            const allEntries: RiachueloTagPriceData[] = []

            for (const item of items) {
                const variants = Array.isArray(item.Variante) ? item.Variante : [item.Variante]

                for (const variant of variants) {
                    allEntries.push({
                        PedidoCodigo: pedidoCodigo,
                        Tamanho: variant.Tamanho.toString() || '',
                        Digito: variant.Digito?.toString() || '',
                        CodDepto: variant.CodDepto?.toString() || '',
                        DataEntrega: variant.DataEntrega?.toString() || '',
                        CodigoBureau: variant.CodigoBureau?.toString() || '',
                        Grade: variant.Grade?.toString() || '',
                        DescricaoMaterial: variant.DescricaoMaterial?.toString() || '',
                        Cor: variant.Cor?.toString() || '',
                        Estacao: variant.Estacao?.toString() || '',
                        EstrColecao: variant.EstrColecao?.toString() || '',
                        PrecoMaterial: variant.PrecoMaterial?.toString() || '',
                        QuantidadeEtiqueta: variant.QuantidadeEtiqueta?.toString() || '',
                        MaterialForn: variant.MaterialForn?.toString() || '',
                    })
                }
            }
            return allEntries
        } catch (error: any) {
            throw new Error(`Error converting Riachuelo price file: ${error.message}`)
        }
    }
}
