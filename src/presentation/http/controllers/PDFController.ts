import { Request, Response } from 'express'
import { GeneratePDF, IPDFGeneratorFactory, ITagsService } from '../../../application/use-cases/GeneratePDF'

export class PDFController {
    private generatePDFUseCase: GeneratePDF

    constructor(
        pdfGeneratorFactory: IPDFGeneratorFactory,
        tagsService: ITagsService
    ) {
        this.generatePDFUseCase = new GeneratePDF(pdfGeneratorFactory, tagsService)
    }

    async generate(req: Request, res: Response): Promise<void> {
        try {
            const { companyCode, tipoEtiqueta, orderNumber, sizesWithQuantities, quantity } = req.body

            if (!companyCode || !tipoEtiqueta) {
                res.status(400).json({ error: 'Parameters codeCompany and typeTag is necessary' })
                return
            }

            let idsQuantities: Array<{ id: string; quantity: number }> = []
            if (sizesWithQuantities) {
                if (typeof sizesWithQuantities === 'string') {
                    try {
                        idsQuantities = JSON.parse(sizesWithQuantities)
                    } catch {
                        res.status(400).json({ error: 'Invalid format for sizesWithQuantities' })
                        return
                    }
                } else if (Array.isArray(sizesWithQuantities)) {
                    idsQuantities = sizesWithQuantities
                }
            }

            const result = await this.generatePDFUseCase.execute({
                companyCode: Number(companyCode),
                tagType: tipoEtiqueta,
                orderNumber,
                quantity: quantity ? Number(quantity) : undefined,
                sizesWithQuantities: idsQuantities.length > 0 ? idsQuantities : undefined,
            })

            if (!result.success || !result.buffer) {
                res.status(500).json({ error: result.error || 'Failed to generate PDF' })
                return
            }

            res.setHeader('Content-Type', 'application/pdf')
            res.setHeader('Content-Disposition', `attachment; filename="${result.fileName}"`)
            res.send(result.buffer)
        } catch (error: any) {
            console.error('Error to generate PDF:', error)
            res.status(500).json({ error: error.message })
        }
    }

    async generateAsync(req: Request, res: Response): Promise<void> {
        try {
            const { companyCode, tipoEtiqueta, orderNumber, sizesWithQuantities, quantity } = req.body

            const jobId = `pdf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

            res.json({
                success: true,
                jobId,
                message: 'Processing started. Use the jobId to check the status.',
            })
        } catch (error: any) {
            console.error('Error to start async generation:', error)
            res.status(500).json({ error: error.message })
        }
    }
}
