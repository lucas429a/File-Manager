import fs from 'fs'

export class FileDetectorBesni {
    static async detectFileType(file: Express.Multer.File) {
        const content = await fs.promises.readFile(file.path, 'utf-8')

        if (content.includes('DATAPACKET') && content.includes('ROWDATA')) {
            return 'price'
        }

        throw new Error('Type of Besni file could not be detected')
    }
}
