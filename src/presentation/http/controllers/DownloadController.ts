import { Request, Response } from 'express'

export class DownloadController {
    async download(req: Request, res: Response): Promise<void> {
        try {
            const { jobId } = req.params

            res.status(404).json({ error: 'Download not found' })
        } catch (error: any) {
            console.error('Erro no download:', error)
            res.status(500).json({ error: error.message })
        }
    }

    async checkStatus(req: Request, res: Response): Promise<void> {
        try {
            const { jobId } = req.params

            res.json({
                jobId,
                status: 'unknown',
                message: 'Status not available',
            })
        } catch (error: any) {
            console.error('Error to check status:', error)
            res.status(500).json({ error: error.message })
        }
    }
}
