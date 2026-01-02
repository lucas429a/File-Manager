export type LinsFerraoVolumeData = {
    COD_DCO: string
    CICLOVIDA: string
    DEPARTAMENTO: string
    DESCRICAO: string
    COR: string
    EAN: string
    SUBSEGMENTO: string
    GRADE_QTD: string
    FAIXA: string
    // QTD?: string
    N_PEDIDO?: string
}

type Input = {
    zplData: string
}

export class LinsFerraoVolumeConverter {
    public parse(input: Input): LinsFerraoVolumeData[] {
        const lines = input.zplData.split('\n').map(line => line.trim())
        const tags: LinsFerraoVolumeData[] = []

        let currentTag: Partial<LinsFerraoVolumeData> = {}
        let inBlock = false

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i]

            if (line.match(/\^FO(30|310|590),25\^A0N,45,34\^FD/)) {
                if (Object.keys(currentTag).length > 0) {
                    tags.push(currentTag as LinsFerraoVolumeData)
                }
                currentTag = {}
                inBlock = true
                const codMatch = line.match(/\^FD(.+?)\^FS/)
                if (codMatch) {
                    currentTag.COD_DCO = codMatch[1]
                }
            }

            if (inBlock) {
                if (line.match(/\^FO(30|310|590),67.*\^A0N,20,20\^FD/)) {
                    const embMatch = line.match(/\^FD(.+?)\^FS/)
                    if (embMatch) currentTag.CICLOVIDA = embMatch[1]
                } else if (line.match(/\^FO(30|310|590),87.*\^A0N,18,13\^FD/)) {
                    const depMatch = line.match(/\^FD(.+?)\^FS/)
                    if (depMatch) currentTag.DEPARTAMENTO = depMatch[1]
                } else if (line.match(/\^FO(30|310|590),120.*\^A0N,18,13\^FD/)) {
                    const corMatch = line.match(/\^FD(.+?)\^FS/)
                    if (corMatch) currentTag.COR = corMatch[1]
                } else if (line.match(/\^FO(30|310|590),178.*\^A0N,15,15\^FD/)) {
                    const subsegMatch = line.match(/\^FD(.+?)\^FS/)
                    if (subsegMatch) currentTag.SUBSEGMENTO = subsegMatch[1]
                } else if (line.match(/\^FO(11|291|571),195.*\^FB.*\^A0N,30,30\^FD/)) {
                    const graMatch = line.match(/\^FD(.+?)\^FS/)
                    if (graMatch) currentTag.GRADE_QTD = graMatch[1]
                } else if (line.match(/\^FO(30|310|590),103.*\^A0N,18,13\^FD/)) {
                    const descMatch = line.match(/\^FD(.+?)\^FS/)
                    if (descMatch) currentTag.DESCRICAO = descMatch[1]
                } else if (line.match(/\^FO(30|310|590),135\^BY2,2\^B2N,40,N,N\^FD\d+\^FS/)) {
                    const eanMatch = line.match(/\^FD(.+?)\^FS/)
                    if (eanMatch) currentTag.EAN = eanMatch[1]
                } else if (line.match(/\^FO(11|291|571),220.*\^FB.*\^A0N,20,20\^FD/)) {
                    const faiMatch = line.match(/\^FD(.+?)\^FS/)
                    if (faiMatch) currentTag.FAIXA = faiMatch[1]
                    inBlock = false
                }
            }
        }

        if (currentTag && Object.keys(currentTag).length > 0) {
            tags.push(currentTag as LinsFerraoVolumeData)
        }

        if (tags.length === 0) {
            throw new Error('Data not found in volume file.')
        }

        return tags
    }
}
