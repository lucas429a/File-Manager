import fs from 'fs'
import { ConverterFactory } from '../../factories/ConverterFactory'
import { FileDetectorDiSantinni } from '../../converters/companies/DiSantini/FileDetectorDiSantini'
import { FileProcessorBase } from '../base/FileProcessorBase'
import { TagDataService } from '../../services/data/TagDataService'

export class DiSantinniFileProcessor extends FileProcessorBase {
    private tagDataService = new TagDataService()

    async processFiles(files: Express.Multer.File[], companyCode: number) {
        if (!files || files.length === 0) {
            throw new Error('file not found for DiSantinni processing.')
        }

        const packFiles: Express.Multer.File[] = []
        const skupriceFiles: Express.Multer.File[] = []

        for (const file of files) {
            const typeTag = await FileDetectorDiSantinni.detectFileType(file)
            if (typeTag === 'pack') {
                packFiles.push(file)
            } else if (typeTag === 'skuprice') {
                skupriceFiles.push(file)
            }
        }

        if (packFiles.length > 0) {
            const packResults = await this.processFilesByType(packFiles, companyCode, 'pack')
            await this.tagDataService.saveToTagsTable(packResults, companyCode, 'pack')
        }

        if (skupriceFiles.length > 0) {
            const skupriceResults = await this.processFilesByType(skupriceFiles, companyCode, 'skuprice')
            await this.tagDataService.saveToTagsTable(skupriceResults, companyCode, 'skuprice')
        }

        return {
            success: true,
            message: 'Arquivos processados com sucesso',
            processedRecords: packFiles.length + skupriceFiles.length,
        }
    }

    async organizeFiles(files: Express.Multer.File[]) {
        if (!files || files.length === 0) {
            throw new Error('file not found for DiSantinni processing.')
        }
        return { files }
    }

    private async processFilesByType(files: Express.Multer.File[], companyCode: number, typeTag: string): Promise<any[]> {
        const allConverted: any[] = []

        for (const file of files) {
            const converter = ConverterFactory.getConverter({ typeTag, codeCompany: companyCode })

            const content = await fs.promises.readFile(file.path, 'utf8')
            let converted = converter.parse({ zplData: content })

            const orderMatch = file.originalname.match(/EtiquetaGrade-(\d+)-/)
            const orderNumber = orderMatch ? orderMatch[1] : null

            if (orderNumber) {
                converted = converted.map((obj: any) => ({ ...obj, nPedido: orderNumber }))
            }

            allConverted.push(...converted)
        }

        return this.aggregateDiSantini(allConverted, typeTag)
    }

    private aggregateDiSantini(data: any[], typeTag: string): any[] {
        const grouped: Record<string, any> = {}

        for (const obj of data) {
            const key = [obj.nPedido, obj.codigoSku, obj.tamanho, obj.descricao, obj.cor, obj.uc, obj.item].join('|')

            if (!grouped[key]) {
                grouped[key] = { ...obj, QTD: '1' }
            } else {
                grouped[key].QTD = (parseInt(grouped[key].QTD, 10) + 1).toString()
            }
        }

        if (typeTag === 'skuprice') {
            Object.values(grouped).forEach((obj: any) => {
                obj.QTD = (parseInt(obj.QTD, 10) * 2).toString()
            })
        }

        return Object.values(grouped)
    }
}
