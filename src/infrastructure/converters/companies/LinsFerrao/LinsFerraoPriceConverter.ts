export type LinsFerraoPriceData = {
    EAN: string
    COR: string
    N_TAMANHO: string
    GRADE: string
    DESCRICAO: string
    SUBSEGMENTO: string
    FAIXA: string
    PRECO_VDA: string
    CICLOVIDA: string
    NOME_EMPRESA: string
    FORNECEDOR: string
    // QTD?: string
    N_PEDIDO?: string
}

type Input = {
    zplData: string
}

export class LinsFerraoPriceConverter {
    public parse(input: Input): LinsFerraoPriceData[] {
        const lines = input.zplData.split('\n').map(line => line.trim())
        const tags: LinsFerraoPriceData[] = []

        let currentTag: Partial<LinsFerraoPriceData> = {}
        let inBlock = false

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i]

            if (line.match(/\^FO(40|320|600),10\^BY2,2\^B2N/)) {
                if (Object.keys(currentTag).length > 0) {
                    tags.push(currentTag as LinsFerraoPriceData)
                }
                currentTag = {}
                inBlock = true
                const eanMatch = line.match(/\^FD(.+?)\^FS/)
                if (eanMatch) {
                    currentTag.EAN = eanMatch[1]
                }
            }

            if (inBlock) {
                if (line.match(/\^FO(20|300|580),98.*\^A0N,30,17\^FD/)) {
                    const corMatch = line.match(/\^FD(.+?)\^FS/)
                    if (corMatch) currentTag.COR = corMatch[1]
                } else if (line.match(/\^FO(178|458|738),98.*\^A0N,30,21\^FD/)) {
                    const tamMatch = line.match(/\^FD(.+?)\^FS/)
                    if (tamMatch) currentTag.N_TAMANHO = tamMatch[1]
                } else if (line.match(/\^FO(180|460|740),211.*\^A0N,13,13\^FD/)) {
                    const graMatch = line.match(/\^FD(.+?)\^FS/)
                    if (graMatch) currentTag.GRADE = graMatch[1]
                } else if (line.match(/\^FO(55|335|615),125.*\^A0N,17,13\^FD/)) {
                    const fornMatch = line.match(/\^FD(.+?)\^FS/)
                    if (fornMatch) currentTag.FORNECEDOR = fornMatch[1]
                } else if (line.match(/\^FO(55|335|615),142.*\^A0N,16,14\^FD/)) {
                    const descMatch = line.match(/\^FD(.+?)\^FS/)
                    if (descMatch) currentTag.DESCRICAO = descMatch[1]
                } else if (line.match(/\^FO(22|302|582),120.*\^A0B,32,32\^FD/)) {
                    const subMatch = line.match(/\^FD(.+?)\^FS/)
                    if (subMatch) currentTag.SUBSEGMENTO = subMatch[1]
                } else if (line.match(/\^FO(55|335|615),160.*\^A0N,16,14\^FD/)) {
                    const faiMatch = line.match(/\^FD(.+?)\^FS/)
                    if (faiMatch) currentTag.FAIXA = faiMatch[1]
                } else if (line.match(/\^FO(50|330|610),184.*\^A0N,30,40\^FD/)) {
                    const precoMatch = line.match(/\^FD(.+?)\^FS/)
                    if (precoMatch) currentTag.PRECO_VDA = precoMatch[1]
                } else if (line.match(/\^FO(55|335|615),197.*\^A0N,13,13\^FD/)) {
                    const cicleMatch = line.match(/\^FD(.+?)\^FS/)
                    if (cicleMatch) currentTag.CICLOVIDA = cicleMatch[1]
                } else if (line.match(/\^FO(246|526|806),175.*\^A0B,16,13\^FD/)) {
                    const empresaMatch = line.match(/\^FD(.+?)\^FS/)
                    if (empresaMatch) currentTag.NOME_EMPRESA = empresaMatch[1]
                    inBlock = false
                }
            }
        }

        if (currentTag && Object.keys(currentTag).length > 0) {
            tags.push(currentTag as LinsFerraoPriceData)
        }

        if (tags.length === 0) {
            throw new Error('data not found in price file.')
        }


        return tags
    }
}
