import { Request, Response } from 'express'
import { ProcessTagFile, IFileProcessorFactory } from '../../../application/use-cases/ProcessTagFile'
import { CompanyRulesService } from '../../../domain/services/CompanyRulesService'
import { clearUploadsFolder } from '../../../shared/utils/clearUploadFolder'

export class UploadController {
    private processTagFileUseCase: ProcessTagFile

    constructor(fileProcessorFactory: IFileProcessorFactory) {
        const companyRulesService = new CompanyRulesService()
        this.processTagFileUseCase = new ProcessTagFile(fileProcessorFactory, companyRulesService)
    }

    async upload(req: Request, res: Response): Promise<void> {
        try {
            const files = req.files as Express.Multer.File[]
            const companyCode = Number(req.query.companyCode || req.body.companyCode)

            if (!files || files.length === 0) {
                res.status(400).json({ error: 'File not found' })
                return
            }

            const result = await this.processTagFileUseCase.execute({
                companyCode,
                files,
            })

            if (result.success) {
                res.json(result)
            } else {
                res.status(400).json(result)
            }
        } catch (error: any) {
            console.error('Error on upload:', error)
            res.status(500).json({ error: error.message })
        } finally {
            await clearUploadsFolder()
        }
    }

    async queueUpload(req: Request, res: Response): Promise<void> {
        try {
            const files = req.files as Express.Multer.File[]
            const companyCode = Number(req.query.companyCode || req.body.companyCode)

            if (!files || files.length === 0) {
                res.status(400).json({ error: 'File not found' })
                return
            }

            const result = await this.processTagFileUseCase.execute({
                companyCode,
                files,
            })

            res.json(result)
        } catch (error: any) {
            console.error('Error on queue upload:', error)
            res.status(500).json({ error: error.message })
        } finally {
            await clearUploadsFolder()
        }
    }
}
