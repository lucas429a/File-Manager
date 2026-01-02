import { parseStringPromise } from 'xml2js'

export type AvenidaTagData = {
    N_PEDIDO: string
    SUBSEGMENTO: string
    COD_DCO: string
    DEPARTAMENTO: string
    CENTRO_FATURAMENTO: string
    FORNECEDOR: string
    DES_CODIGO_DESTINO: string
    DES_ENDERECO: string
    COD_BARRA_CD_ATUAL: string
    UC: string
    DESCRICAO: string
    ITEM: string
    VOLUME: string
    PRECO_VDA: string
    QTD_TOTAL: string
    COD_BARRA: string
    COR: string
    N_TAMANHO: string
    QTD: string
    DES_AUXILIAR_1: string
    FAIXA: string
    CICLOVIDA: string
    CODIGO_DIGITO?: string
}

type Input = {
    xmlData: string
}

export class AvenidaTagConverter {
    public async parse(input: Input): Promise<AvenidaTagData[]> {
        try {
            const result = await parseStringPromise(input.xmlData, {
                explicitArray: false,
                ignoreAttrs: false,
            })

            if (!result.AvXML) {
                throw new Error('XML invalid structure: AvXML not found')
            }

            const capa = result.AvXML.capa
            const locEntr = result.AvXML.loc_entr

            if (!capa || !locEntr) {
                throw new Error('XML invalid structure: capa/loc_entr not found')
            }

            const allEntries: AvenidaTagData[] = []

            const commonData = {
                N_PEDIDO: capa.pedido.toString() || '',
                SUBSEGMENTO: capa.familia?.toString() || '',
                COD_DCO: capa.lin_prod.toString() || '',
                DEPARTAMENTO: capa.depto?.toString() || '',
                CENTRO_FATURAMENTO: capa.fornecedor?.toString() || '',
                FORNECEDOR: capa.raz_social?.toString() || '',
                DES_CODIGO_DESTINO: capa.emissao?.toString() || '',
                DES_ENDERECO: capa.entrega?.toString() || '',
                CICLOVIDA: capa.familia?.toString() || '',
                COD_BARRA_CD_ATUAL: locEntr.CD?.toString() || '',
                DES_AUXILIAR_1: locEntr.$?.CD?.toString() || '',
                FAIXA: locEntr.$?.Ped_CD?.toString() || '',
            }

            const items = Array.isArray(locEntr.item) ? locEntr.item : [locEntr.item]

            for (const item of items) {
                if (!item) continue

                const itemData = {
                    UC: item.cod_item?.toString() || '',
                    DESCRICAO: item.den_item?.toString() || '',
                    ITEM: item.referencia?.toString() || '',
                    VOLUME: item.pack.toString() || '',
                    PRECO_VDA: item.preco?.toString() || '',
                    QTD_TOTAL: item.qtd_pack?.toString() || '',
                    CODIGO_DIGITO: item.$?.nSeq?.toString() || '',
                }

                const grades = Array.isArray(item.grade) ? item.grade : [item.grade]

                for (const grade of grades) {
                    if (!grade) continue

                    allEntries.push({
                        ...commonData,
                        ...itemData,
                        COD_BARRA: grade.barcode?.toString() || '',
                        COR: grade.color?.toString() || '',
                        N_TAMANHO: grade.size?.toString() || '',
                        QTD: grade.qtde?.toString() || '',
                    })
                }
            }

            return allEntries
        } catch (error: any) {
            throw new Error(`Error converting Avenida XML file: ${error.message}`)
        }
    }
}
