import { Request, Response } from 'express'
import { GetTags, DeleteTags } from '../../../application/use-cases/GetTags'
import { GetOrdersByCompany } from '../../../application/use-cases/GetOrdersByCompany'
import { ITagRepository } from '../../../domain/repositories/ITagRepository'

export class TagController {
    private getTagsUseCase: GetTags
    private deleteTagsUseCase: DeleteTags
    private getOrdersByCompanyUseCase: GetOrdersByCompany

    constructor(tagRepository: ITagRepository) {
        this.getTagsUseCase = new GetTags(tagRepository)
        this.deleteTagsUseCase = new DeleteTags(tagRepository)
        this.getOrdersByCompanyUseCase = new GetOrdersByCompany(tagRepository)
    }

    async list(req: Request, res: Response): Promise<void> {
        try {
            const { companyCode, orderNumber, tagType, color, model } = req.query

            const result = await this.getTagsUseCase.execute({
                companyCode: Number(companyCode),
                orderNumber: orderNumber as string | undefined,
                tagType: tagType as string | undefined,
                color: color as string | undefined,
                model: model as string | undefined,
            })

            res.json(result.tags)
        } catch (error: any) {
            console.error('Error on list tags:', error)
            res.status(500).json({ error: error.message })
        }
    }

    async getOrdersByCompany(req: Request, res: Response): Promise<void> {
        try {
            const { companyCode } = req.query

            const result = await this.getOrdersByCompanyUseCase.execute({
                companyCode: Number(companyCode),
            })

            res.json(result.orders)
        } catch (error: any) {
            console.error('Error to fetch orders:', error)
            res.status(500).json({ error: error.message })
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const { orderNumber, companyId } = req.query

            const result = await this.deleteTagsUseCase.execute({
                orderNumber: orderNumber as string,
                companyId: Number(companyId),
            })

            res.json(result)
        } catch (error: any) {
            console.error('Error to delete tags:', error)
            res.status(500).json({ error: error.message })
        }
    }
}
