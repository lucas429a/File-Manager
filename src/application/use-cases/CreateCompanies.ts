import { CreateCompaniesInputDTO, CreateCompaniesOutputDTO } from '../dto/CompanyDTO'
import { ICompanyRepository } from '../../domain/repositories/ICompanyRepository'
import { Company } from '../../domain/entities/Company'
import { CompanyMapper } from '../mappers/CompanyMapper'

export class CreateCompanies {
    constructor(private readonly companyRepository: ICompanyRepository) {}

    async execute(input: CreateCompaniesInputDTO): Promise<CreateCompaniesOutputDTO> {
        const created = []
        const errors = []

        for (const companyData of input.companies) {
            try {

                if (!companyData.id) {
                    throw new Error('ID is required')
                }

                if (!companyData.name || companyData.name.trim() === '') {
                    throw new Error('Company name is required')
                }

                const existingCompany = await this.companyRepository.findById(companyData.id)
                if (existingCompany) {
                    throw new Error(`Company with ID ${companyData.id} already exists`)
                }

                const company = Company.create({
                    id: companyData.id,
                    name: companyData.name.trim(),
                    alias: companyData.alias?.trim() || null,
                })

                const savedCompany = await this.companyRepository.save(company)
                created.push(CompanyMapper.toDTO(savedCompany))
            } catch (error: any) {
                errors.push({
                    company: companyData,
                    error: error.message || 'Unknown error while creating company',
                })
            }
        }

        return {
            created,
            errors,
        }
    }
}
