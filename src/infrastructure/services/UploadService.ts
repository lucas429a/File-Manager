import { FileProcessorFactory } from '../factories/FileProcessorFactory'

export class FileProcessor {
    public static async handleUploadRequest(params: any, files: Express.Multer.File[]) {
        const { companyCode } = params

        if (!companyCode) {
            throw new Error('Código da empresa não fornecido')
        }

        const companyCodeNumber = Number(companyCode)

        if (isNaN(companyCodeNumber)) {
            throw new Error(`Código da empresa inválido: ${companyCode}`)
        }

        try {
            const processor = FileProcessorFactory.getProcessor(Number(companyCode))
            return await processor.processFiles(files, Number(companyCode))
        } catch (error: any) {
            console.error('Erro no processamento:', error)
            throw new Error(`Falha no processamento dos arquivos: ${error.message}`)
        }
    }
}
