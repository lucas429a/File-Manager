import { Router, Request, Response } from 'express'
import { TagController } from '../controllers/TagController'
import { PrismaTagRepository } from '../../../infrastructure/persistence/repositories/PrismaTagRepository'

export function tagRoutes(): Router {
    const router = Router()
    const tagRepository = new PrismaTagRepository()
    const tagController = new TagController(tagRepository)

    router.get('/', (req: Request, res: Response) => tagController.list(req, res))

    router.get('/orders', (req: Request, res: Response) => tagController.getOrdersByCompany(req, res))

    router.delete('/', (req: Request, res: Response) => tagController.delete(req, res))

    return router
}
