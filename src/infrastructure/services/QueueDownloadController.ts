import fs from 'fs'

import { Request, Response } from 'express'
import { PDFJobQueueService } from './QueueDownloadService'
import { clearUploadsFolder } from '../../utils/clearUploadFolder'

export class QueueDownloadController {
    private jobQueueService = new PDFJobQueueService()

    async handleAsyncPDFGeneration(req: Request, res: Response): Promise<void> {
        try {
            const { companyCode, typeTag, orderNumber, sizesWithQuantities, quantity } = req.body

            if (!companyCode || !typeTag) {
                res.status(400).json({ error: 'Parâmetros companyCode e tipoEtiqueta são obrigatórios' })
                return
            }

            const code = parseInt(companyCode, 10)
            if (isNaN(code)) {
                res.status(400).json({ error: 'Código da loja inválido' })
                return
            }

            let idsQuantities: Array<{ id: string; quantity: number }> = []
            if (sizesWithQuantities) {
                if (typeof sizesWithQuantities === 'string') {
                    try {
                        idsQuantities = JSON.parse(sizesWithQuantities)
                    } catch {
                        res.status(400).json({ error: 'Formato inválido para sizesWithQuantities' })
                        return
                    }
                } else if (Array.isArray(sizesWithQuantities)) {
                    idsQuantities = sizesWithQuantities
                }
            }

            const jobId = this.jobQueueService.createJob(code, typeTag, orderNumber, idsQuantities.length > 0 ? idsQuantities : undefined)
            res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
            res.setHeader('Cache-Control', 'no-cache')
            res.setHeader('Connection', 'keep-alive')
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.setHeader('X-Accel-Buffering', 'no')

            this.jobQueueService.onProgress(jobId, progress => {
                if (!res.writableEnded) {
                    res.write(`data: ${JSON.stringify(progress)}\n\n`)
                }
            })

            try {
                await this.jobQueueService.processJob(jobId)

                if (!res.writableEnded) {
                    res.write(
                        `data: ${JSON.stringify({
                            jobId,
                            status: 'completed',
                            progress: 100,
                            message: 'PDF pronto para download',
                            pdfReady: true,
                            timestamp: new Date(),
                        })}\n\n`,
                    )
                    res.end()
                }
            } catch (error: any) {
                if (!res.writableEnded) {
                    res.write(
                        `data: ${JSON.stringify({
                            jobId,
                            status: 'failed',
                            progress: 0,
                            message: 'Erro ao gerar PDF',
                            error: error.message,
                            timestamp: new Date(),
                        })}\n\n`,
                    )
                    res.end()
                }
            }
        } catch (error: any) {
            console.error('Erro inesperado ao gerar PDF:', error)
            if (!res.writableEnded) {
                res.status(500).json({ error: 'Erro ao processar a solicitação' })
            }
        }
        // finally {
        //     clearUploadsFolder()
        // }
    }

    async handlePDFDownloadById(req: Request, res: Response): Promise<void> {
        try {
            const { jobId } = req.params

            if (!jobId) {
                res.status(400).json({ error: 'Parâmetro id é obrigatório' })
                return
            }

            const job = this.jobQueueService.getJob(jobId)

            if (!job) {
                res.status(404).json({ error: 'ID não encontrado' })
                return
            }

            if (job.status === 'processing' || job.status === 'pending') {
                res.status(409).json({ message: 'O PDF ainda está sendo gerado.', status: job.status, progress: job.progress })
                return
            }

            if (job.status === 'failed') {
                res.status(500).json({ error: 'Falha ao gerar o PDF: ' + job.error })
                return
            }

            if (!job.pdfFilePath || !fs.existsSync(job.pdfFilePath)) {
                res.status(500).json({ error: 'O PDF não está disponível no momento.' })
                return
            }

            const fileName = `${job.companyCode}_${job.typeTag}_.pdf`
            const pdfBuffer = fs.readFileSync(job.pdfFilePath)

            res.setHeader('Content-Type', 'application/pdf')
            res.setHeader('Content-Disposition', `attachment; filename=${fileName}`)
            res.setHeader('Content-Length', pdfBuffer.length)
            res.send(pdfBuffer)

            setTimeout(() => {
                this.jobQueueService.deleteJob(jobId)
            }, 60000)
        } catch (error: any) {
            console.error('Erro ao fazer download do PDF:', error)
            res.status(500).json({ error: 'Erro ao processar a solicitação' })
        } finally {
            clearUploadsFolder()
        }
    }

    async checkJobStatus(req: Request, res: Response): Promise<void> {
        try {
            const { jobId } = req.params

            if (!jobId) {
                res.status(400).json({ error: 'Id é obrigatório' })
                return
            }

            const job = this.jobQueueService.getJob(jobId)

            if (!job) {
                res.status(404).json({ error: 'ID não encontrado' })
                return
            }

            res.json({
                jobId: job.id,
                status: job.status,
                progress: job.progress,
                error: job.error,
                createdAt: job.createdAt,
                completedAt: job.completedAt,
            })
        } catch (error: any) {
            console.error('Erro ao verificar status do job:', error)
            res.status(500).json({ error: 'Erro ao processar a solicitação' })
        }
    }
}
