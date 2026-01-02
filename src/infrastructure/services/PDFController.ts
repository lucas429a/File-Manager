import { PDFGeneratorFactory } from '../factories/PDFGeneratorFactory'
import { TagsService } from './TagsDownload.Service'
import { Request, Response } from 'express'
import { clearUploadsFolder } from '../../utils/clearUploadFolder'

const tagsPerPage: Record<string, Record<string, number>> = {
    1758846: {
        corrugado: 1,
        frontbox: 2,
        palmilha: 1,
        calcentertag: 2,
    },
    1742590: {
        price: 1,
        volume: 1,
        sku: 1,
    },
    1756059: {
        pricebesni: 2,
    },
    1757040: {
        pricedigaspi: 2,
    },
    1742619: {
        pack: 1,
        skuprice: 1,
        pricedisantinni: 2,
    },
    1760014: {
        avenidaprice: 2,
        avenidapack: 1,
        avenidainsole: 2,
    },
    1758860: {
        torratag: 2,
    },
    1760026: {
        humanitarian: 2,
    },
    1758780: {
        pernambucanastag: 2,
    },
    3132717: {
        lfvolume: 3,
        lfprice: 3,
    },
    1756084: {
        caeduvolume: 1,
        caeduprice: 2,
        caedunoprice: 2,
    },
    1758779: {
        ceaprice: 1,
        ceapack: 1,
    },
}

export class PDFController {
    private getTagsPerPage(companyCode: number, typeTag: string): number {
        const normalizedTag = typeTag.trim().toLowerCase()
        return tagsPerPage[companyCode]?.[normalizedTag] || 1
    }

    private calculateRequiredInputs(quantity: number, tagsPerPage: number): number {
        if (!quantity || quantity <= 0) {
            return 0
        }
        return Math.ceil(quantity / tagsPerPage)
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

    async generatePDF(companyCode: number, typeTag: string, orderNumber?: string): Promise<Buffer> {
        try {
            const tagsService = new TagsService()
            const data = await tagsService.getTagsByType(companyCode, typeTag, orderNumber)

            const generator = PDFGeneratorFactory.getGenerator({ typeTag, codeCompany: companyCode })
            const outputFileName = `${companyCode}_${typeTag}_${Date.now()}.pdf`
            const pdf = await generator.generate(outputFileName, data)

            if (!pdf) {
                throw new Error('Falha ao gerar PDF: resultado indefinido')
            }

            return Buffer.from(pdf)
        } catch (error) {
            console.error('Erro ao gerar PDF:', error)
            throw error
        }
    }

    async handlePDFDownload(req: Request, res: Response): Promise<void> {
        try {
            const { companyCode, tipoEtiqueta, orderNumber, sizesWithQuantities, quantity } = req.body as Record<string, any>

            if (!companyCode || !tipoEtiqueta) {
                res.status(400).json({ error: 'Parâmetros codeCompany e tipoEtiqueta são obrigatórios' })
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
                } else {
                    res.status(400).json({ error: 'Formato inválido para sizesWithQuantities' })
                    return
                }
            }

            let pdf: Buffer
            if (idsQuantities.length > 0) {
                pdf = await this.generatePDFByIds(code, tipoEtiqueta, orderNumber, idsQuantities)
            } else {
                if (quantity && quantity > 0) {
                    pdf = await this.generatePDFWithQuantity(code, tipoEtiqueta, orderNumber, quantity)
                } else {
                    pdf = await this.generatePDF(code, tipoEtiqueta, orderNumber)
                }
            }

            const fileName = `${code}_${tipoEtiqueta}_${Date.now()}.pdf`
            res.setHeader('Content-Type', 'application/pdf')
            res.setHeader('Content-Disposition', `attachment; filename=${fileName}`)
            res.setHeader('Content-Length', pdf.length)
            res.send(pdf)
        } catch (error) {
            console.error('Erro inesperado ao gerar PDF:', error)
            res.status(500).json({ error: 'Erro ao processar a solicitação' })
        } finally {
            clearUploadsFolder()
        }
    }

    async generatePDFWithQuantity(companyCode: number, typeTag: string, orderNumber: string | undefined, quantity: number): Promise<Buffer> {
        const tagsService = new TagsService()
        const tagsPerPage = this.getTagsPerPage(companyCode, typeTag)
        const requiredInputs = this.calculateRequiredInputs(quantity, tagsPerPage)

        let data = await tagsService.getTagsByType(companyCode, typeTag, orderNumber)

        if (data.length === 0) {
            throw new Error('Nenhuma etiqueta encontrada para os critérios especificados')
        }

        data = this.expandTagsByQuantity(data, requiredInputs)

        const generator = PDFGeneratorFactory.getGenerator({ typeTag, codeCompany: companyCode })
        const outputFileName = `${companyCode}_${typeTag}_${Date.now()}.pdf`
        const pdf = await generator.generate(outputFileName, data)

        if (!pdf) {
            throw new Error('Falha ao gerar PDF: resultado indefinido')
        }

        return Buffer.from(pdf)
    }

    async generatePDFByIds(companyCode: number, typeTag: string, orderNumber: string | undefined, idsQuantities: Array<{ id: string; quantity: number }>): Promise<Buffer> {
        const tagsService = new TagsService()
        const tagsPerPage = this.getTagsPerPage(companyCode, typeTag)
        let allTags: any[] = []

        for (const { id, quantity } of idsQuantities) {
            const tags = await tagsService.getTagsByType(companyCode, typeTag, orderNumber, undefined, id)

            if (tags.length > 0) {
                const requiredInputs = this.calculateRequiredInputs(quantity, tagsPerPage)
                const expandedTags = this.expandTagsByQuantity(tags, requiredInputs)
                allTags = allTags.concat(expandedTags)
            }
        }

        if (allTags.length === 0) {
            throw new Error('Nenhuma etiqueta encontrada para os IDs especificados')
        }

        const generator = PDFGeneratorFactory.getGenerator({ typeTag, codeCompany: companyCode })
        const outputFileName = `${companyCode}_${typeTag}_${Date.now()}.pdf`
        const pdf = await generator.generate(outputFileName, allTags)

        if (!pdf) {
            throw new Error('Falha ao gerar PDF: resultado indefinido')
        }

        return Buffer.from(pdf)
    }
}
