export type DiSantiniPriceSkuData = {
    nPedido: string
    codigoSku: string
    tamanho: string
    descricao: string
    cor: string
    preco: string
    uc: string
    item: string
    QTD: string
    faixa: string
}

type Input = {
    zplData: string
}

export class DiSantiniPriceSKUConverter {
    public parse(input: Input): DiSantiniPriceSkuData[] {
        const lines = input.zplData.split('\n').map(line => line.trim())
        const tags: DiSantiniPriceSkuData[] = []

        let currentTag: Partial<DiSantiniPriceSkuData> = {}
        let qtdEtiquetas = '1'
        let inBlock = false

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i]

            if (line.startsWith('^FX==== PEDIDO:') && line.includes('ETIQUETA ESQUERDA')) {
                currentTag = {}
                inBlock = true
                const match = line.match(/PEDIDO:\s*(\d+).*COD:\s*([^\s]+).*TAM:\s*([^\s]+).*ETQ\.\s*\d+\s*de\s*(\d+)/)
                if (match) {
                    currentTag.nPedido = match[1]
                    currentTag.codigoSku = match[2]
                    currentTag.tamanho = match[3]
                }
            }

            if (line.startsWith('^FX==== PEDIDO:') && line.includes('ETIQUETA DIREITA')) {
                const matchQtd = line.match(/ETQ\.\s*\d+\s*de\s*(\d+)/)
                if (matchQtd) {
                    qtdEtiquetas = matchQtd[1]
                }
            }

            if (inBlock) {
                if (line.match(/^\^FO(05|320),135\^ApN/)) {
                    currentTag.descricao = line.match(/\^FD(.+?) \^FS/)?.[1] || ''
                } else if (line.match(/^\^FO(05|320),160\^ApN/)) {
                    currentTag.uc = line.match(/\^FD(.+?) \^FS/)?.[1] || ''
                } else if (line.match(/^\^FO(05|320),205\^APN/)) {
                    currentTag.cor = line.match(/\^FD(.+?) \^FS/)?.[1] || ''
                } else if (line.match(/^\^FO(060|370),320\^ARN/)) {
                    currentTag.tamanho = (line.match(/\^FD(.+?) \^FS/)?.[1] || '').replace('TAM:', '').trim()
                } else if (line.match(/^\^FO(05|320),110\^ACN/)) {
                    currentTag.codigoSku = line.match(/\^FD(.+?) \^FS/)?.[1] || ''
                } else if (line.match(/^\^FO(060|375),190\^BQN/)) {
                    currentTag.item = line.match(/\^FDLA,(.+?) \^FS/)?.[1] || ''
                } else if (line.match(/^\^FO(05|320),185\^APN/)) {
                    currentTag.faixa = line.match(/\^FD(.+?)\^FS/)?.[1] || ''
                } else if (line.match(/^\^FO(05|320),380\^ARN/)) {
                    const precoMatch = line.match(/\^FD\s*R?\$?([\d.,]+)\s*\^FS/)
                    currentTag.preco = precoMatch ? `R$${precoMatch[1]}` : ''
                }
            }

            if (line.startsWith('^XZ') && inBlock) {
                if (currentTag.nPedido) {
                    const qtdFinal = (parseInt(qtdEtiquetas, 10) * 2).toString()
                    tags.push({ ...(currentTag as DiSantiniPriceSkuData), QTD: qtdFinal })
                }
                currentTag = {}
                qtdEtiquetas = '1'
                inBlock = false
            }
        }

        if (tags.length === 0) {
            throw new Error('Data DiSantini PriceSKU not found')
        }

        return tags
    }
}
