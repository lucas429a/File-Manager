import { clearUploadsFolder } from '../../utils/clearUploadFolder'
import { PDFGeneratorFactory } from '../factories/PDFGeneratorFactory'
import { TagsService } from './TagsDownload.Service'
import path from 'path'
import fs from 'fs'

///////////////////////// aaaaaaaaaa vv
export interface PDFJob {
    id: string
    companyCode: number
    typeTag: string
    orderNumber?: string
    quantity?: number
    idsQuantities?: Array<{ id: string; quantity: number }>
    status: 'pending' | 'processing' | 'completed' | 'failed'
    progress: number
    pdfFilePath?: string
    error?: string
    createdAt: Date
    completedAt?: Date
}

export interface PDFJobProgress {
    jobId: string
    status: PDFJob['status']
    progress: number
    message: string
    totalPages?: number
    processedPages?: number
    pdfReady?: boolean
    error?: string
    timestamp: Date
}

export type PDFProgressCallback = (progress: PDFJobProgress) => void

export class PDFJobQueueService {
    private jobs: Map<string, PDFJob> = new Map()
    private progressCallbacks: Map<string, PDFProgressCallback[]> = new Map()
    private tagService = new TagsService()
    private readonly JOB_EXPIRY_TIME = 10 * 60 * 1000
    private readonly UPLOAD_DIR = path.resolve(__dirname, '../../../uploads')

    constructor() {
        setInterval(() => this.cleanExpiredJobs(), 5 * 60 * 1000)
    }

    private generateJobId(): string {
        return `pdf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }

    private notifyProgress(jobId: string, progress: Partial<PDFJobProgress>): void {
        const callbacks = this.progressCallbacks.get(jobId) || []
        const fullProgress: PDFJobProgress = {
            jobId,
            status: 'processing',
            progress: 0,
            message: '',
            timestamp: new Date(),
            ...progress,
        }

        callbacks.forEach(callback => {
            callback(fullProgress)
        })
    }

    onProgress(jobId: string, callback: PDFProgressCallback): void {
        if (!this.progressCallbacks.has(jobId)) {
            this.progressCallbacks.set(jobId, [])
        }
        this.progressCallbacks.get(jobId)!.push(callback)
    }

    clearProgressCallbacks(jobId: string): void {
        this.progressCallbacks.delete(jobId)
    }

    createJob(companyCode: number, typeTag: string, orderNumber?: string, idsQuantities?: Array<{ id: string; quantity: number }>): string {
        const jobId = this.generateJobId()
        const job: PDFJob = {
            id: jobId,
            companyCode,
            typeTag,
            orderNumber,
            idsQuantities,
            status: 'pending',
            progress: 0,
            createdAt: new Date(),
        }
        this.jobs.set(jobId, job)
        return jobId
    }

    async processJob(jobId: string): Promise<void> {
        const job = this.jobs.get(jobId)
        if (!job) {
            throw new Error(`Job with ID ${jobId} not found`)
        }

        try {
            job.status = 'processing'
            job.progress = 0
            this.notifyProgress(jobId, { status: 'processing', progress: 0, message: 'Geração dos PDFs foi iniciada' })

            let totalTags = 0
            let allTags: any[] = []

            this.notifyProgress(jobId, {
                progress: 10,
                message: 'Carregando dados...',
            })

            if (job.idsQuantities && job.idsQuantities.length > 0) {
                const tagsPerPage = this.getTagsPerPage(job.companyCode, job.typeTag)

                for (const { id, quantity } of job.idsQuantities) {
                    const tags = await this.tagService.getTagsByType(job.companyCode, job.typeTag, job.orderNumber, undefined, id)

                    if (tags.length > 0) {
                        const requiredInputs = Math.ceil(quantity / tagsPerPage)
                        const expandedTags = this.expandTagsByQuantity(tags, requiredInputs)
                        allTags = allTags.concat(expandedTags)
                    }
                }
            }

            if (allTags.length === 0) {
                throw new Error('Nenhuma etiqueta encontrada')
            }

            totalTags = allTags.length

            this.notifyProgress(jobId, {
                progress: 30,
                message: `Gerando PDF com ${totalTags} etiquetas, o Download Será iniciado assim que estiver pronto...`,
                totalPages: totalTags,
                processedPages: 0,
            })

            const generator = PDFGeneratorFactory.getGenerator({
                typeTag: job.typeTag,
                codeCompany: job.companyCode,
            })

            const outputFileName = `${job.companyCode}_${job.typeTag}_${Date.now()}.pdf`
            const pdfBuffer = await generator.generate(outputFileName, allTags)

            if (!pdfBuffer) {
                throw new Error('Falha ao gerar PDF: resultado indefinido ')
            }

            const filePath = path.join(this.UPLOAD_DIR, outputFileName)
            fs.writeFileSync(filePath, pdfBuffer)

            job.pdfFilePath = filePath
            job.status = 'completed'
            job.progress = 100
            job.completedAt = new Date()

            this.notifyProgress(jobId, {
                status: 'completed',
                progress: 100,
                message: 'Geração dos PDFs concluída com sucesso',
                pdfReady: true,
                totalPages: totalTags,
                processedPages: totalTags,
            })
        } catch (error: any) {
            job.status = 'failed'
            job.error = error.message
            job.completedAt = new Date()

            this.notifyProgress(jobId, {
                status: 'failed',
                progress: job.progress,
                message: 'Erro ao gerar os PDFs: ' + error.message,
                error: error.message,
            })

            console.error(`Erro ao processar o job ${jobId}:`, error)
            throw error
        }
    }

    getJob(jobId: string): PDFJob | undefined {
        return this.jobs.get(jobId)
    }

    deleteJob(jobId: string): void {
        this.jobs.delete(jobId)
        this.clearProgressCallbacks(jobId)
        clearUploadsFolder()
    }

    private cleanExpiredJobs(): void {
        const now = Date.now()
        for (const [jobId, job] of this.jobs.entries()) {
            const jobAge = now - job.createdAt.getTime()
            if ((jobAge > this.JOB_EXPIRY_TIME && job.status === 'completed') || job.status === 'failed') {
                this.deleteJob(jobId)
                console.log('Job expirado removido:', jobId)
            }
        }
    }

    private getTagsPerPage(companyCode: number, typeTag: string): number {
        const tagsPerPage: Record<string, Record<string, number>> = {
            '1758846': { corrugado: 1, frontbox: 2, palmilha: 1, calcentertag: 2 },
            '1742590': { price: 1, volume: 1, sku: 1 },
            '1756059': { pricebesni: 2 },
            '1757040': { pricedigaspi: 2 },
            '1742619': { pack: 1, skuprice: 1, pricedisantinni: 2 },
            '1760014': { avenidaprice: 2, avenidapack: 1, avenidainsole: 2 },
            '1758860': { torratag: 2 },
            '1760026': { humanitarian: 2 },
            '1758780': { pernambucanastag: 2 },
            '3132717': { lfvolume: 3, lfprice: 3 },
            '1756084': { caeduvolume: 1, caeduprice: 2, caedunoprice: 2 },
            '1758779': { ceaprice: 1, ceapack: 1 },
        }

        const normalizedTag = typeTag.trim().toLowerCase()
        return tagsPerPage[companyCode]?.[normalizedTag] || 1
    }

    private expandTagsByQuantity(data: any[], requiredInputs: number): any[] {
        if (requiredInputs <= 0 || data.length === 0) {
            return data
        }

        if (data.length >= requiredInputs) {
            return data.slice(0, requiredInputs)
        }

        const expandedData: any[] = []
        let index = 0

        while (expandedData.length < requiredInputs) {
            expandedData.push(data[index % data.length])
            index++
        }

        return expandedData
    }
}
