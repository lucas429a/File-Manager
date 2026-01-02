export class OrderNumberExtractor {
    static extractOrderNumber(fileName: string): string | null {
        const match = fileName.match(/\d{5,}/)
        return match ? match[0] : null
    }

    static groupFilesByOrderNumber(files: Express.Multer.File[]): Map<string, Express.Multer.File[]> {
        const groupedFiles = new Map<string, Express.Multer.File[]>()

        for (const file of files) {
            const orderNumber = this.extractOrderNumber(file.originalname)

            if (orderNumber) {
                if (!groupedFiles.has(orderNumber)) {
                    groupedFiles.set(orderNumber, [])
                }
                groupedFiles.get(orderNumber)!.push(file)
            }
        }

        return groupedFiles
    }
}
