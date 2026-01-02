import { TagDataService } from '../../services/data/TagDataService'
import { FileProcessorBase } from '../base/FileProcessorBase'
import { FileParser } from '../utils/FileParser'

export class AvenidaFileProcessor extends FileProcessorBase {
    private fileParser: FileParser
    private tagDataService: TagDataService

    constructor() {
        super()
        this.fileParser = new FileParser()
        this.tagDataService = new TagDataService()
    }

    async processFiles(files: Express.Multer.File[], companyCode: number): Promise<any> {
        const organizedFiles = await this.organizeFiles(files)
        const result = await this.fileParser.readAndParseFile(organizedFiles.avenida, {
            typeTag: 'avenidaprice',
            codeCompany: companyCode,
        })

        const allData = result.parsedData

        const priceData = allData
        const packData = allData.length > 0 ? [allData[0]] : []
        const insoleData = allData

        const priceResult = await this.tagDataService.saveToTagsTable(priceData, companyCode, 'avenidaprice')
        const packResult = await this.tagDataService.saveToTagsTable(packData, companyCode, 'avenidapack')
        const insoleResult = await this.tagDataService.saveToTagsTable(insoleData, companyCode, 'avenidainsole')

        return { priceResult, packResult, insoleResult }

        // return await this.tagDataService.saveToTagsTable(result.parsedData, companyCode, 'avenida')
    }

    async organizeFiles(files: Express.Multer.File[]): Promise<any> {
        if (!files || files.length !== 1) {
            throw new Error('Only one file is allowed for Avenida processing.')
        }

        return { avenida: files[0] }
    }
}
