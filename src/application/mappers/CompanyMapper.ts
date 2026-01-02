import { Company } from '../../domain/entities/Company'
import { CompanyDTO } from '../dto/CompanyDTO'

export class CompanyMapper {
    public static toDTO(company: Company): CompanyDTO {
        return {
            id: company.id,
            name: company.name,
            alias: company.alias,
            tagTypes: company.tagTypes,
        }
    }

    public static toDomain(dto: CompanyDTO): Company {
        return Company.create({
            id: dto.id,
            name: dto.name,
            alias: dto.alias,
            tagTypes: dto.tagTypes,
        })
    }

    public static toPersistence(company: Company): Record<string, any> {
        return {
            ID: company.id,
            NOME: company.name,
            APELIDO: company.alias,
        }
    }

    public static fromPersistence(data: Record<string, any>): Company {
        return Company.restore({
            id: data.ID,
            name: data.NOME,
            alias: data.APELIDO,
            tagTypes: [],
        })
    }

    public static toDTOList(companies: Company[]): CompanyDTO[] {
        return companies.map(company => this.toDTO(company))
    }
}
