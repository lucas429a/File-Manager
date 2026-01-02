export type DiSantinniPackData = {
    uc: string
    grade: string
    gradeQuantidades: string
    referencia: string
    cor: string
    descricao: string
    item: string
    codigoSku: string
}

type Input = {
    zplData: string
}

export class DiSantiniPackConverter {
    public parse(input: Input): DiSantinniPackData[] {
        const lines = input.zplData.split('\n').map(line => line.trim())
        const tags: DiSantinniPackData[] = []

        let currentTag: Partial<DiSantinniPackData> = {}

        for (const line of lines) {
            if (line.startsWith('^FO066,040^ARN')) {
                currentTag.uc = line.match(/\^FD(.+?) \^FS/)?.[1] || ''
            } else if (line.startsWith('^FO060,180^AqN')) {
                currentTag.grade = line.match(/\^FD(.+?) \^FS/)?.[1]
            } else if (line.startsWith('^FO070,205^APN')) {
                currentTag.gradeQuantidades = line.match(/\^FD(.+?) \^FS/)?.[1]
            } else if (line.startsWith('^FO055,155^AQN')) {
                currentTag.referencia = line.match(/\^FD(.+?) \^FS/)?.[1] || ''
            } else if (line.startsWith('^FO055,155^AQN')) {
                currentTag.item = line.match(/\^FD(.+?) \^FS/)?.[1] || ''
            } else if (line.startsWith('^FO270,205^ARN')) {
                currentTag.descricao = line.match(/\^FD(.+?) ?\^FS/)?.[1] || ''
            } else if (line.startsWith('^FO066,075^BY2')) {
                currentTag.codigoSku = line.match(/\^FD(.+?) ?\^FS/)?.[1] || ''
            } else if (line.startsWith('^FO295,155^AQN')) {
                currentTag.cor = line.match(/\^FD(.+?) \^FS/)?.[1] || ''
            }
            if (line.startsWith('^XZ')) {
                if (Object.keys(currentTag).length > 0) {
                    tags.push(currentTag as DiSantinniPackData)
                    currentTag = {}
                }
            }
        }

        if (tags.length === 0) {
            throw new Error('Tags data not found.')
        }

        return tags
    }
}
