import fs from 'fs'
import { FileProcessorBase } from '../base/FileProcessorBase'
import { FileParser } from '../utils/FileParser'
import { TagDataService } from '../../services/data/TagDataService'
import { FileDetectorCeA } from '../../converters/companies/CeA/CeAFileDetector'

export class CeAFileProcessor extends FileProcessorBase {
    private fileParser: FileParser
    private tagDataService: TagDataService

    constructor() {
        super()
        this.fileParser = new FileParser()
        this.tagDataService = new TagDataService()
    }

    async processFiles(files: Express.Multer.File[], codeCompany: number): Promise<any> {
        try {
            const organizedData = await this.organizeFiles(files)

            for (const { file, typeTag } of organizedData) {
                const result = await this.fileParser.readAndParseFile(file, {
                    typeTag,
                    codeCompany,
                })

                if (result.parsedData && result.parsedData.length > 0) {
                    const saveResult = await this.tagDataService.saveToTagsTable(result.parsedData, codeCompany, typeTag)
                    return saveResult
                }
            }
        } catch (error: any) {
            console.error('Error to process CeA files:', error)
            throw new Error(`Error to process CeA files: ${error.message}`)
        }
    }

    async organizeFiles(files: Express.Multer.File[]): Promise<Array<{ file: Express.Multer.File; typeTag: string }>> {
        const organized: Array<{ file: Express.Multer.File; typeTag: string }> = []

        for (const file of files) {
            try {
                const content = await fs.promises.readFile(file.path, 'utf-8')
                const fileType = FileDetectorCeA.detectFileType(content)

                if (fileType === 'price') {
                    organized.push({ file, typeTag: 'ceaprice' })
                } else if (fileType === 'pack') {
                    organized.push({ file, typeTag: 'ceapack' })
                } else {
                    console.warn(`Unrecognized file type: ${file.originalname}`)
                }
            } catch (error: any) {
                console.error(`Error detecting file type for ${file.originalname}:`, error)
            }
        }

        return organized
    }
}
