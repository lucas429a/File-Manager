import { Router, Request, Response } from 'express'
import { PDFController } from '../controllers/PDFController'
import { PDFGeneratorFactory } from '../../../infrastructure/factories/PDFGeneratorFactory'
import { TagsService } from '../../../infrastructure/services/TagsDownload.Service'

export function pdfRoutes(): Router {
    const router = Router()
    const tagsService = new TagsService()

    const pdfGeneratorFactoryAdapter = {
        getGenerator: (params: { typeTag: string; codeCompany: number }) => 
            PDFGeneratorFactory.getGenerator(params)
    }

    const tagsServiceAdapter = {
        getTagsByType: async (companyCode: number, tagType: string, orderNumber?: string) => {
            return tagsService.getTagsByType(companyCode, tagType, orderNumber)
        },
        getTagsByIds: async (ids: string[], companyCode?: number, tagType?: string) => {
            const results: any[] = []
            for (const id of ids) {
                const tagFromDb = await tagsService.getTagById(id)
                if (tagFromDb) {
                    results.push(tagFromDb)
                }
            }
            return results
        },
        getTagById: async (id: string) => {
            return tagsService.getTagById(id)
        },
    }

    const pdfController = new PDFController(pdfGeneratorFactoryAdapter, tagsServiceAdapter)


    router.post('/generate', (req: Request, res: Response) => pdfController.generate(req, res))


    router.post('/generate-async', (req: Request, res: Response) => pdfController.generateAsync(req, res))


    router.post('/', (req: Request, res: Response) => pdfController.generate(req, res))

    return router
}
