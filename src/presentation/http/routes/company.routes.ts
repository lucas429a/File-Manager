import { Router, Request, Response } from 'express'
import { CompanyController } from '../controllers/CompanyController'
import { PrismaCompanyRepository } from '../../../infrastructure/persistence/repositories/PrismaCompanyRepository'
import { PrismaTagRepository } from '../../../infrastructure/persistence/repositories/PrismaTagRepository'

export function companyRoutes(): Router {
    const router = Router()
    const companyRepository = new PrismaCompanyRepository()
    const tagRepository = new PrismaTagRepository()
    const companyController = new CompanyController(companyRepository, tagRepository)

    router.get('/', (req: Request, res: Response) => companyController.list(req, res))

    router.post('/', (req: Request, res: Response) => companyController.create(req, res))
    
    router.get('/tag-types', (req: Request, res: Response) => companyController.getTagTypes(req, res))

    return router
}
