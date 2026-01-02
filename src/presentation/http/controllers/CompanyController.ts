import { Request, Response } from 'express'
import { GetCompanyList } from '../../../application/use-cases/GetCompanyList'
import { GetTagTypesByCompany } from '../../../application/use-cases/GetTagTypesByCompany'
import { CreateCompanies } from '../../../application/use-cases/CreateCompanies'
import { ICompanyRepository } from '../../../domain/repositories/ICompanyRepository'
import { ITagRepository } from '../../../domain/repositories/ITagRepository'

export class CompanyController {
    private getCompanyListUseCase: GetCompanyList
    private getTagTypesByCompanyUseCase: GetTagTypesByCompany
    private createCompaniesUseCase: CreateCompanies

    constructor(
        companyRepository: ICompanyRepository,
        tagRepository: ITagRepository
    ) {
        this.getCompanyListUseCase = new GetCompanyList(companyRepository)
        this.getTagTypesByCompanyUseCase = new GetTagTypesByCompany(tagRepository)
        this.createCompaniesUseCase = new CreateCompanies(companyRepository)
    }

    async list(req: Request, res: Response): Promise<void> {
        try {
            const result = await this.getCompanyListUseCase.execute()
            res.json(result.companies)
        } catch (error: any) {
            console.error('Error to list companies:', error)
            res.status(500).json({ error: error.message })
        }
    }

    async getTagTypes(req: Request, res: Response): Promise<void> {
        try {
            const { companyCode, orderNumber } = req.query

            const result = await this.getTagTypesByCompanyUseCase.execute({
                companyCode: Number(companyCode),
                orderNumber: orderNumber as string | undefined,
            })

            res.json(result.tagTypes)
        } catch (error: any) {
            console.error('Error to fetch tag types:', error)
            res.status(500).json({ error: error.message })
        }
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const { companies } = req.body

            if (!Array.isArray(companies) || companies.length === 0) {
                res.status(400).json({
                    error: 'It is necessary to provide an array of companies with at least one item',
                })
                return
            }

            const result = await this.createCompaniesUseCase.execute({ companies })

            if (result.errors.length > 0) {
                res.status(207).json({
                    message: 'Some companies were not created',
                    created: result.created,
                    errors: result.errors,
                })
            } else {
                res.status(201).json({
                    message: 'All companies were created successfully',
                    created: result.created,
                })
            }
        } catch (error: any) {
            console.error('Error to create companies:', error)
            res.status(500).json({ error: error.message })
        }
    }
}
