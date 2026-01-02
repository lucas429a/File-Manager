import fs from 'fs'

export class FileDetectorDiSantinni {
    static async detectFileType(file: Express.Multer.File): Promise<'skuprice' | 'pack'> {
        const content = await fs.promises.readFile(file.path, 'utf8')

        if (content.includes('DS GRADE') || content.includes('GRADE')) {
            return 'pack'
        }

        return 'skuprice'
    }
}
