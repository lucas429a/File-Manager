import { CompanyDTO, CompanyListOutputDTO } from '../dto/CompanyDTO'
import { ICompanyRepository } from '../../domain/repositories/ICompanyRepository'
import { CompanyMapper } from '../mappers/CompanyMapper'

export class GetCompanyList {
    constructor(private readonly companyRepository: ICompanyRepository) {}

    async execute(): Promise<CompanyListOutputDTO> {
        try {
            const companies = await this.companyRepository.findAll()
            const companyDTOs = companies.map(company => CompanyMapper.toDTO(company))

            return {
                companies: companyDTOs,
            }
        } catch (error: any) {
            throw new Error(`error in search ${error.message}`)
        }
    }
}
