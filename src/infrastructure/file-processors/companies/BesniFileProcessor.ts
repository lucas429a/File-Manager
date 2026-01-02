import { TagDataService } from '../../services/data/TagDataService'
import { FileDetectorBesni } from '../../converters/companies/Besni/FileDetectorBesni'
import { FileProcessorBase } from '../base/FileProcessorBase'
import { FileParser } from '../utils/FileParser'

export class BesniFileProcessor extends FileProcessorBase {
    private fileParser: FileParser
    private tagDataService: TagDataService

    constructor() {
        super()
        this.fileParser = new FileParser()
        this.tagDataService = new TagDataService()
    }

    async processFiles(files: Express.Multer.File[], companyCode: number): Promise<any> {
        const organizedFiles = await this.organizeFiles(files)
        const priceResult = await this.fileParser.readAndParseFile(organizedFiles.price, {
            typeTag: 'pricebesni',
            codeCompany: companyCode,
        })

        return await this.tagDataService.saveToTagsTable(priceResult.parsedData, companyCode, 'pricebesni')
    }

    async organizeFiles(files: Express.Multer.File[]): Promise<any> {
        const organizedFiles: { [key: string]: Express.Multer.File } = {}

        for (const file of files) {
            const fileType = await FileDetectorBesni.detectFileType(file)
            organizedFiles[fileType] = file
        }

        if (!organizedFiles.price) {
            throw new Error('File of type price is required for Besni processing.')
        }

        return organizedFiles
    }
}
