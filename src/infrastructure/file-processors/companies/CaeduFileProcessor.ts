import { TagDataService } from '../../services/data/TagDataService'
import { FileDetectorCaedu } from '../../converters/companies/Caedu/FileDetectorCaedu'
import { FileProcessorBase } from '../base/FileProcessorBase'
import { FileParser } from '../utils/FileParser'

export class CaeduFileProcessor extends FileProcessorBase {
    private fileParser: FileParser
    private tagDataService: TagDataService

    constructor() {
        super()
        this.fileParser = new FileParser()
        this.tagDataService = new TagDataService()
    }

    async processFiles(files: Express.Multer.File[], companyCode: number): Promise<any> {
        const organizedFiles = await this.organizeFiles(files)
        const results: any = {}

        if (organizedFiles.price) {
            const priceResult = await this.fileParser.readAndParseFile(organizedFiles.price, {
                typeTag: 'caeduprice',
                codeCompany: companyCode,
            })
            const priceData = priceResult.parsedData
            results.price = await this.tagDataService.saveToTagsTable(priceData, companyCode, 'caeduprice', 'caedunoprice')
        }

        if (organizedFiles.volume) {
            const volumeResult = await this.fileParser.readAndParseFile(organizedFiles.volume, {
                typeTag: 'caeduvolume',
                codeCompany: companyCode,
            })

            results.volume = await this.tagDataService.saveToTagsTable(volumeResult.parsedData, companyCode, 'caeduvolume')
        }

        let totalProcessedRecords = 0
        for (const key in results) {
            totalProcessedRecords += results[key].processedRecords || 0
        }

        return { success: true, message: 'Arquivos processados com sucesso', processedRecords: totalProcessedRecords }
    }

    async organizeFiles(files: Express.Multer.File[]): Promise<any> {
        if (!files || files.length === 0) {
            throw new Error('No files provided for Caedu processing.')
        }

        const organizedFiles: { [key: string]: Express.Multer.File } = {}

        for (const file of files) {
            const fileType = await FileDetectorCaedu.detectFileType(file)
            organizedFiles[fileType] = file
        }

        return organizedFiles
    }
}
