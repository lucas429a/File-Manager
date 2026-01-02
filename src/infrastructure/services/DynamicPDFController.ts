import { Response, Request } from 'express'
import { DynamicTagService } from './DynamicTagService'
import { clearUploadsFolder } from '../../utils/clearUploadFolder'

export class DynamicPDFController {
    private dynamicTagService: DynamicTagService

    constructor() {
        this.dynamicTagService = new DynamicTagService()
    }

    async handleDynamicPDFDownload(req: Request, res: Response) {
        try {
            const { companyCode, template, data, quantity } = req.body

            if (!companyCode || !template || !data) {
                return res.status(400).json({
                    message: 'Tipo de etiqueta e Empresa são obrigatórios.',
                })
            }
            const result = await this.dynamicTagService.generateDynamicPDF(Number(companyCode), template, data, quantity)
            if (!result.success) {
                return res.status(400).json(result)
            }
            res.setHeader('Content-Type', 'application/pdf')
            res.setHeader('Content-Disposition', `attachment; filename="${result.fileName}"`)
            return res.send(result.buffer)
        } catch (error: any) {
            return res.status(500).json({
                successs: false,
                message: 'Falha ao processar o PDF dinâmico: ' + error.message,
            })
        } finally {
            clearUploadsFolder()
        }
    }

    async getDynamicTagOptions(req: Request, res: Response) {
        try {
            const { companyCode, template } = req.query
            if (!companyCode || !template) {
                return res.status(400).json({
                    success: false,
                    message: 'Parâmetros de empresa e template são obrigatórios',
                })
            }

            const options = await this.dynamicTagService.getDynamicTagOptions(Number(companyCode), template.toString())
            return res.status(200).json(options)
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Erro ao buscar opções de tags dinâmicas: ',
            })
        }
    }

    async listDynamicTags(req: Request, res: Response) {
        try {
            const { companyCode } = req.query

            if (!companyCode) {
                return res.status(400).json({
                    success: false,
                    message: 'Código da empresa é obrigatório.',
                })
            }

            const tags = await this.dynamicTagService.listDynamicTags(Number(companyCode))
            return res.status(200).json({ success: true, tags })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Erro ao listar tags dinâmicas',
            })
        }
    }

    async addProductToTemplate(req: Request, res: Response) {
        try {
            const { companyCode, template, product } = req.body

            if (!companyCode || !template || !product) {
                return res.status(400).json({
                    success: false,
                    message: 'companyCode, template e product são obrigatórios.',
                })
            }

            const updatedOptions = await this.dynamicTagService.addProductOption(Number(companyCode), template.toString(), product)

            return res.status(200).json(updatedOptions)
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: 'Erro ao adicionar product em COMPLETE_OPTIONS: ' + (error.message ?? error),
            })
        }
    }
}
