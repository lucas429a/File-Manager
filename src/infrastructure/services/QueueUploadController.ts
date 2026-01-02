import { Request, Response } from 'express'
import { UploadQueueService } from './QueueUploadService'
import { OrderNumberExtractor } from '../../utils/OrderNumberExtractor'

export class QueueUploadController {
    private queueService = new UploadQueueService()

    async handleQueueUpload(companyCode: number, files: Express.Multer.File[], req: Request, res: Response): Promise<void> {
        try {
            if (!companyCode) {
                res.status(400).json({
                    success: false,
                    message: 'Código da empresa não fornecido',
                })
                return
            }

            if (!files || files.length === 0) {
                res.status(400).json({
                    success: false,
                    message: 'Nenhum arquivo foi enviado',
                })
                return
            }

            const groupedFiles = OrderNumberExtractor.groupFilesByOrderNumber(files)

            if (groupedFiles.size === 0) {
                res.status(400).json({
                    success: false,
                    message: 'Nenhum número de pedido foi identificado nos arquivos',
                })
                return
            }

            for (const [orderNumber, orderFiles] of groupedFiles.entries()) {
                this.queueService.enqueue(orderNumber, orderFiles, companyCode)
            }

            res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
            res.setHeader('Cache-Control', 'no-cache')
            res.setHeader('Connection', 'keep-alive')
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.setHeader('X-Accel-Buffering', 'no')

            this.queueService.onProgress(progress => {
                if (!res.writableEnded) {
                    res.write(`data: ${JSON.stringify(progress)}\n\n`)
                }
            })

            const results = await this.queueService.processQueue()

            if (!res.writableEnded) {
                res.write(
                    `data: ${JSON.stringify({
                        isComplete: true,
                        totalOrders: results.length,
                        results: results,
                        timestamp: new Date(),
                    })}\n\n`,
                )
                res.end()
            }
        } catch (error: any) {
            console.error('Erro no controlador de fila de upload:', error)

            if (!res.writableEnded) {
                res.status(500).json({
                    success: false,
                    message: 'Erro ao processar fila de upload',
                    error: error.message,
                })
            }
        } finally {
            this.queueService.clearProgressCallbacks()
        }
    }
}
