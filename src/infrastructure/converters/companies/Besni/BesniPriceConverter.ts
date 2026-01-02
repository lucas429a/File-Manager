import { parseStringPromise } from 'xml2js'

export type BesniPriceData = {
    semana: string
    matforn: string
    tema: string
    tend: string
    padr: string
    direc: string
    linha: string
    tamanho: string
    cor: string
    corforn: string
    gmerc: string
    ean13: string
    codigo: string
    codigock: string
    valor: string
    pedido: string
    qtde: string
}

type Input = {
    xmlData: string
}

export class BesniPriceConverter {
    public async parse(input: Input): Promise<BesniPriceData[]> {
        try {
            const result = await parseStringPromise(input.xmlData, {
                explicitArray: false,
                mergeAttrs: true,
            })

            if (!result.DATAPACKET || !result.DATAPACKET.ROWDATA) {
                throw new Error('Format XML invalid: DATAPACKET/ROWDATA structure not found')
            }

            const rowData = result.DATAPACKET.ROWDATA
            const rows = Array.isArray(rowData.ROW) ? rowData.ROW : [rowData.ROW]

            if (!rows || rows.length === 0) {
                throw new Error('No rows found in the XML')
            }

            const allEntries: BesniPriceData[] = []

            for (const row of rows) {
                if (!row) continue

                allEntries.push({
                    semana: row.semana?.toString() || '',
                    matforn: row.matforn?.toString() || '',
                    tema: row.tema?.toString() || '',
                    tend: row.tend?.toString() || '',
                    padr: row.padr?.toString() || '',
                    direc: row.direc?.toString() || '',
                    linha: row.linha?.toString() || '',
                    tamanho: row.tamanho?.toString() || '',
                    cor: row.cor?.toString() || '',
                    corforn: row.corforn?.toString() || '',
                    gmerc: row.gmerc?.toString() || '',
                    ean13: row.ean13?.toString() || '',
                    codigo: row.codigo?.toString() || '',
                    codigock: row.codigock?.toString() || '',
                    valor: row.valor?.toString() || '',
                    pedido: row.pedido?.toString() || '',
                    qtde: row.qtde?.toString() || '',
                })
            }

            return allEntries
        } catch (error: any) {
            throw new Error(`Error converting Besni XML file: ${error.message}`)
        }
    }
}
