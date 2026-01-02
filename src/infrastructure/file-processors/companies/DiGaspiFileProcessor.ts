import { TagDataService } from '../../services/data/TagDataService'
import { FileProcessorBase } from '../base/FileProcessorBase'
import { FileParser } from '../utils/FileParser'

export class DiGaspiFileProcessor extends FileProcessorBase {
    private tagDataService = new TagDataService()
    private fileParser = new FileParser()

    async processFiles(files: Express.Multer.File[], companyCode: number) {
        const organizedFiles = await this.organizeFiles(files)
        const result = await this.fileParser.readAndParseFile(organizedFiles.pricedigaspi, { typeTag: 'pricedigaspi', codeCompany: companyCode })
        return await this.tagDataService.saveToTagsTable(result.parsedData, companyCode, 'pricedigaspi')
    }

    async organizeFiles(files: Express.Multer.File[]) {
        if (!files || files.length !== 1) {
            throw new Error('Is necessary 1 file to process DiGaspi.')
        }
        return { pricedigaspi: files[0] }
    }
}
