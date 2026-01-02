import { TagDataService } from '../../services/data/TagDataService'
import { TorraTagConverter } from '../../converters/companies/Torra/TorraTagConverter'
import { FileProcessorBase } from '../base/FileProcessorBase'
import { FileParser } from '../utils/FileParser'

export class TorraFileProcessor extends FileProcessorBase {
    private fileParser: FileParser
    private tagDataService: TagDataService

    constructor() {
        super()
        this.fileParser = new FileParser()
        this.tagDataService = new TagDataService()
    }

    async processFiles(files: Express.Multer.File[], companyCode: number) {
        const organizedFiles = await this.organizeFiles(files)
        const result = await this.fileParser.readAndParseFile(organizedFiles.torra, {
            typeTag: 'torratag',
            codeCompany: companyCode,
        })

        const saveResult = await this.tagDataService.saveToTagsTable(result.parsedData, companyCode, 'torratag')
        return saveResult
    }

    async organizeFiles(files: Express.Multer.File[]): Promise<any> {
        if (!files || files.length !== 1) {
            throw new Error('Only one file is necessary to process Torra.')
        }

        return { torra: files[0] }
    }
}
