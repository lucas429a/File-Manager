import { TagDataService } from '../../services/data/TagDataService'
import { FileDetectorRiachuelo } from '../../converters/companies/Riachuelo/FileDetectorRiachuelo'
import { FileProcessorBase } from '../base/FileProcessorBase'
import { FileParser } from '../utils/FileParser'

export class RiachueloFileProcessor extends FileProcessorBase {
    private tagDataService = new TagDataService()
    private fileParser = new FileParser()

    async processFiles(files: any, companyCode: number) {
        try {
            const organizedFiles = await this.organizeFiles(files)

            const priceResult = await this.fileParser.readAndParseFile(organizedFiles.price, { typeTag: 'price', codeCompany: companyCode })
            const volumeResult = await this.fileParser.readAndParseFile(organizedFiles.volume, { typeTag: 'volume', codeCompany: companyCode })
            const skuResult = organizedFiles.sku ? await this.fileParser.readAndParseFile(organizedFiles.sku, { typeTag: 'sku', codeCompany: companyCode }) : null

            const priceResultSave = await this.tagDataService.saveToTagsTable(priceResult.parsedData, companyCode, 'price')
            const volumeResultSave = await this.tagDataService.saveToTagsTable(volumeResult.parsedData, companyCode, 'volume')
            const skuResultSave = skuResult
                ? await this.tagDataService.saveToTagsTable(skuResult.parsedData, companyCode, 'sku')
                : { success: false, message: 'SKU file not found', processedRecords: 0 }

            const totalProcessed = priceResultSave.processedRecords + volumeResultSave.processedRecords + skuResultSave.processedRecords

            return {
                success: totalProcessed > 0,
                message: totalProcessed > 0 ? `Novos dados processados com sucesso: ${totalProcessed}` : 'Nenhum novo dado para salvar',
                processedRecords: totalProcessed,
            }
        } catch (error: any) {
            console.error('Error on proccess Riachuelo file:', error)
            throw error
        }
    }
    async organizeFiles(files: Express.Multer.File[]) {
        const organizedFiles: { [key: string]: Express.Multer.File } = {}

        for (const file of files) {
            const fileType = await FileDetectorRiachuelo.detectFileType(file)
            organizedFiles[fileType] = file
        }

        if (!organizedFiles.price || !organizedFiles.volume) {
            throw new Error('Required files (price/volume) not found')
        }

        return organizedFiles
    }
}
