import { Company } from '../entities/Company'

export interface ICompanyRepository {
    findById(id: number): Promise<Company | null>
    findByName(name: string): Promise<Company | null>
    findAll(): Promise<Company[]>
    getTagTypes(companyId: number): Promise<string[]>
    save(company: Company): Promise<Company>
}
