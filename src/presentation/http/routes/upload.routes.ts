import { Router, Request, Response, NextFunction } from 'express'
import { UploadController } from '../controllers/UploadController'
import { FileProcessorFactory } from '../../../infrastructure/factories/FileProcessorFactory'
import { uploadMiddleware } from '../middlewares/upload'
import { clearUploadsFolder } from '../../../shared/utils/clearUploadFolder'

export function uploadRoutes(): Router {
    const router = Router()
    
    const fileProcessorFactoryAdapter = {
        getProcessor: (companyCode: number) => FileProcessorFactory.getProcessor(companyCode)
    }
    
    const uploadController = new UploadController(fileProcessorFactoryAdapter)

    router.post(
        '/',
        uploadMiddleware,
        async (req: Request, res: Response) => {
            await uploadController.upload(req, res)
        }
    )

    router.post(
        '/queue',
        uploadMiddleware,
        async (req: Request, res: Response) => {
            await uploadController.queueUpload(req, res)
        }
    )

    return router
}
