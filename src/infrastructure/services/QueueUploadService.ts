import { FileProcessor } from './UploadService'

export interface QueueJobResult {
    orderNumber: string
    success: boolean
    message: string
    processedRecords?: number
    error?: string
}

export interface QueueProgressCallback {
    (progress: QueueProgress): void
}

export interface QueueProgress {
    totalOrders: number
    processedOrders: number
    currentOrder: string
    results?: QueueJobResult[]
    isComplete: boolean
    timestamp: Date
}

export class UploadQueueService {
    private queue: Array<{ orderNumber: string; files: Express.Multer.File[]; companyCode: number }> = []
    private isProcessing = false
    private progressCallbacks: QueueProgressCallback[] = []
    private results: QueueJobResult[] = []

    onProgress(callback: QueueProgressCallback): void {
        this.progressCallbacks.push(callback)
    }

    clearProgressCallbacks(): void {
        this.progressCallbacks = []
    }

    private notifyProgress(currentOrder: string, processed: number, total: number): void {
        const progress: QueueProgress = {
            totalOrders: total,
            processedOrders: processed,
            currentOrder,
            results: [...this.results],
            isComplete: processed === total,
            timestamp: new Date(),
        }

        this.progressCallbacks.forEach(callback => {
            try {
                callback(progress)
            } catch (error) {
                console.error('Error in progress callback:', error)
            }
        })
    }

    enqueue(orderNumber: string, files: Express.Multer.File[], companyCode: number): void {
        this.queue.push({ orderNumber, files, companyCode })
    }

    async processQueue(): Promise<QueueJobResult[]> {
        if (this.isProcessing) {
            throw new Error('Fila já está sendo processada')
        }

        this.isProcessing = true
        this.results = []
        const totalOrders = this.queue.length

        try {
            let processedCount = 0

            while (this.queue.length > 0) {
                const job = this.queue.shift()!
                const orderNumber = job.orderNumber

                this.notifyProgress(orderNumber, processedCount, totalOrders)

                try {
                    const result = await FileProcessor.handleUploadRequest({ companyCode: job.companyCode }, job.files)

                    const jobResult: QueueJobResult = {
                        orderNumber,
                        success: result.success !== false,
                        message: result.message || 'Processado com sucesso',
                        processedRecords: result.processedRecords,
                    }

                    this.results.push(jobResult)
                } catch (error: any) {
                    const jobResult: QueueJobResult = {
                        orderNumber,
                        success: false,
                        message: 'Erro ao processar pedido',
                        error: error.message,
                    }

                    this.results.push(jobResult)
                    console.error(`Erro ao processar pedido ${orderNumber}:`, error)
                }

                processedCount++
                this.notifyProgress(orderNumber, processedCount, totalOrders)
            }
        } finally {
            this.isProcessing = false
        }

        return this.results
    }

    size(): number {
        return this.queue.length
    }

    clear(): void {
        this.queue = []
        this.results = []
    }

    isProcessingQueue(): boolean {
        return this.isProcessing
    }
}
