export class FileDetectorCaedu {
    static async detectFileType(file: Express.Multer.File): Promise<string> {
        const fileName = file.originalname.toLowerCase()

        if (fileName.includes('preco') || fileName.includes('price')) {
            return 'price'
        }

        if (fileName.includes('interna')) {
            return 'volume'
        }

        throw new Error('Type of file CAEDU not valid.')
    }
}
