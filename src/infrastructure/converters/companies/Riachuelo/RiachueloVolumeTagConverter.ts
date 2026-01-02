import { parseStringPromise } from 'xml2js'

export interface RiachueloVolumeTagData {
    NomeForn: string
    PedidoCodigo: string
    ItemPedido: string
    CodigoMaterial: string
    codMercadoria: string
    DescricaoMaterial: string
    numVolume: string
    QuantidadePeca: string
    centroentrega: string
    centrofaturamento: string
    codBarraCdAtual: string
    codBarra: string
    desEndereco: string
    desAuxiliar_1: string
    desAuxiliar_2: string
    codDco: string
    desCodigoDestino: string
    qtdeTotal: string
    itemQuebra: string
    quantidade: string
}

export class RiachueloVolumeTagConverter {
    public async parse(input: { xmlData: string }): Promise<RiachueloVolumeTagData[]> {
        try {
            const result = await parseStringPromise(input.xmlData, {
                explicitArray: false,
                mergeAttrs: true,
            })

            if (!result.Volume || !result.Volume.PedidoRiac) {
                throw new Error('Invalido Riachuelo volume file structure.')
            }

            const pedidoRiac = result.Volume.PedidoRiac
            const pedidoCodigo = pedidoRiac.Codigo
            const lojas = Array.isArray(pedidoRiac.Loja) ? pedidoRiac.Loja : [pedidoRiac.Loja]

            const allEntries: RiachueloVolumeTagData[] = []

            for (const loja of lojas) {
                const cabecalho = {
                    NomeForn: loja.NomeForn?.toString() || '',
                    PedidoCodigo: pedidoCodigo,
                    ItemPedido: loja.ItemPedido?.toString() || '',
                    CodigoMaterial: loja.CodigoMaterial?.toString() || '',
                    DescricaoMaterial: loja.DescricaoMaterial?.toString() || '',
                    QuantidadePeca: loja.QuantidadePeca?.toString() || '',
                    centroentrega: loja.centroentrega?.toString() || '',
                    centrofaturamento: loja.centrofaturamento?.toString() || '',
                }

                const etiquetas = Array.isArray(loja.DADOS_VOLUME.ETIQUETA) ? loja.DADOS_VOLUME.ETIQUETA : [loja.DADOS_VOLUME.ETIQUETA]

                for (const etiqueta of etiquetas) {
                    allEntries.push({
                        ...cabecalho,
                        itemQuebra: etiqueta.itemQuebra?.toString() || '',
                        numVolume: etiqueta.numVolume?.toString() || '',
                        codMercadoria: etiqueta.codMercadoria?.toString() || '',
                        codBarraCdAtual: etiqueta.codBarraCdAtual?.toString() || '',
                        codBarra: etiqueta.codBarra?.toString() || '',
                        desEndereco: etiqueta.desEndereco?.toString() || '',
                        desAuxiliar_1: etiqueta.desAuxiliar_1?.toString() || '',
                        desAuxiliar_2: etiqueta.desAuxiliar_2?.toString() || '',
                        codDco: etiqueta.codDco?.toString() || '',
                        desCodigoDestino: etiqueta.desCodigoDestino?.toString() || '',
                        qtdeTotal: etiqueta.qtdeTotal?.toString() || '',
                        quantidade: '1',
                    })
                }
            }

            return allEntries
        } catch (error: any) {
            throw new Error(`Error converting Riachuelo volume file: ${error.message}`)
        }
    }
}
