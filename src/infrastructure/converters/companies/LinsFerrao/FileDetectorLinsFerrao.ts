import fs from 'fs'

export class FileDetectorLinsFerrao {
    static async detectFileType(file: Express.Multer.File): Promise<string> {
        const content = await fs.promises.readFile(file.path, 'utf8')

        if (content.includes('Modulo(s)')) {
            return 'lfvolume'
        } else {
            return 'lfprice'
        }
    }
}
