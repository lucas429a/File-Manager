import fs from 'fs'

export class FileDetectorCalcenter {
    private static readonly KEYWORDS = {
        CORRUGADO: 'CORRUGADO',
        FRONTBOX: 'FRENTE DE CAIXA DO CALCADO',
        PALMILHA: 'OCULTA CALCADO',
    }

    static async detectFileType(file: Express.Multer.File): Promise<string> {
        const content = await fs.promises.readFile(file.path, 'utf8')

        if (content.includes(this.KEYWORDS.CORRUGADO)) {
            return 'corrugado'
        }

        if (content.includes(this.KEYWORDS.FRONTBOX)) {
            return 'frontbox'
        }

        if (content.includes(this.KEYWORDS.PALMILHA)) {
            return 'palmilha'
        }

        throw new Error(`Type of file Calcenter not valid : ${file.originalname}`)
    }
}
