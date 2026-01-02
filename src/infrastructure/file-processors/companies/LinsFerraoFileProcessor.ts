import fs from 'fs'
import { ConverterFactory } from '../../factories/ConverterFactory'
import { TagDataService } from '../../services/data/TagDataService'
import { FileDetectorLinsFerrao } from '../../converters/companies/LinsFerrao/FileDetectorLinsFerrao'
import { FileProcessorBase } from '../base/FileProcessorBase'

export class LinsFerraoFileProcessor extends FileProcessorBase {
    private tagDataService = new TagDataService()

    async processFiles(files: Express.Multer.File[], companyCode: number) {
        if (!files || files.length === 0) {
            throw new Error('Not found files for LinsFerrao processing.')
        }

        const priceFiles: Express.Multer.File[] = []
        const volumeFiles: Express.Multer.File[] = []

        for (const file of files) {
            const typeTag = await FileDetectorLinsFerrao.detectFileType(file)
            if (typeTag === 'lfprice') {
                priceFiles.push(file)
            } else if (typeTag === 'lfvolume') {
                volumeFiles.push(file)
            }
        }

        if (priceFiles.length > 0) {
            const priceResults = await this.processFilesByType(priceFiles, companyCode, 'lfprice')
            await this.tagDataService.saveToTagsTable(priceResults, companyCode, 'lfprice')
        }

        if (volumeFiles.length > 0) {
            const volumeResults = await this.processFilesByType(volumeFiles, companyCode, 'lfvolume')
            await this.tagDataService.saveToTagsTable(volumeResults, companyCode, 'lfvolume')
        }

        return { success: true, message: 'Arquivos processados com sucesso', processedRecords: priceFiles.length + volumeFiles.length }
    }

    async organizeFiles(files: Express.Multer.File[]) {
        if (!files || files.length === 0) {
            throw new Error('Not found files for LinsFerrao processing.')
        }
        return { files }
    }

    private async processFilesByType(files: Express.Multer.File[], companyCode: number, typeTag: string): Promise<any[]> {
        let allConverted: any[] = []

        for (const file of files) {
            const converter = ConverterFactory.getConverter({ typeTag, codeCompany: companyCode })

            const content = await fs.promises.readFile(file.path, 'utf8')
            let converted = converter.parse({ zplData: content })

            const orderMatch = file.originalname.match(/_(\d+)_(PRECO|MODULO)_zpl/)
            const orderNumber = orderMatch ? orderMatch[1] : null

            if (orderNumber) {
                converted = converted.map((obj: any) => ({
                    ...obj,
                    N_PEDIDO: orderNumber,
                }))
            }

            allConverted.push(...converted)
        }

        return this.aggregateLinsFerrao(allConverted, typeTag)
    }

    private aggregateLinsFerrao(data: any[], typeTag: string): any[] {
        const grouped: Record<string, any> = {}

        for (const obj of data) {
            let key: string

            if (typeTag === 'lfprice') {
                key = [obj.N_PEDIDO, obj.EAN, obj.COR, obj.N_TAMANHO, obj.DESCRICAO, obj.SUBSEGMENTO].join('|')
            } else if (typeTag === 'lfvolume') {
                key = [obj.N_PEDIDO, obj.COD_DCO, obj.EAN, obj.COR].join('|')
            } else {
                key = Object.values(obj).join('|')
            }

            if (!grouped[key]) {
                grouped[key] = { ...obj, QTD: 1 }
            } else {
                grouped[key].QTD = grouped[key].QTD + 1
            }
        }

        return Object.values(grouped)
    }
}
