import { Router, Request, Response } from 'express'
import { DownloadController } from '../controllers/DownloadController'

export function downloadRoutes(): Router {
    const router = Router()
    const downloadController = new DownloadController()
    
    router.get('/:jobId', (req: Request, res: Response) => downloadController.download(req, res))

    router.get('/status/:jobId', (req: Request, res: Response) => downloadController.checkStatus(req, res))

    return router
}
