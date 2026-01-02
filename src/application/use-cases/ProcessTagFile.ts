import { ProcessTagFileInputDTO, ProcessTagFileOutputDTO } from '../dto/ProcessTagFileDTO'
import { CompanyRulesService } from '../../domain/services/CompanyRulesService'

export interface IFileProcessor {
    processFiles(files: Express.Multer.File[], companyCode: number): Promise<any>
}

export interface IFileProcessorFactory {
    getProcessor(companyCode: number): IFileProcessor
}

export class ProcessTagFile {
    constructor(
        private readonly fileProcessorFactory: IFileProcessorFactory,
        private readonly companyRulesService: CompanyRulesService
    ) {}

    async execute(input: ProcessTagFileInputDTO): Promise<ProcessTagFileOutputDTO> {
        const { companyCode, files } = input

        if (!companyCode) {
            return {
                success: false,
                message: 'Code company not found',
                errors: ['Code company is required'],
            }
        }

        if (!files || files.length === 0) {
            return {
                success: false,
                message: 'No files were uploaded',
                errors: ['At least one file must be uploaded'],
            }
        }

        const fileValidation = this.companyRulesService.validateFileCount(companyCode, files.length)
        if (!fileValidation.isValid) {
            return {
                success: false,
                message: fileValidation.message || 'Invalid file count',
                errors: [fileValidation.message || 'Invalid file count'],
            }
        }

        try {
            const processor = this.fileProcessorFactory.getProcessor(companyCode)
            const result = await processor.processFiles(files, companyCode)

            return {
                success: true,
                message: 'Files processed successfully',
                orderNumber: result.orderNumber,
                tagCount: result.tagCount,
                tagTypes: result.tagTypes,
            }
        } catch (error: any) {
            return {
                success: false,
                message: `Failed to process files: ${error.message}`,
                errors: [error.message],
            }
        }
    }
}
