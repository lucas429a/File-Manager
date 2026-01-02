import { ICompanyRepository } from '../../../domain/repositories/ICompanyRepository'
import { Company } from '../../../domain/entities/Company'
import { CompanyMapper } from '../../../application/mappers/CompanyMapper'
import prisma from '../prisma/client'

export class PrismaCompanyRepository implements ICompanyRepository {
    async findById(id: number): Promise<Company | null> {
        const company = await prisma.empresa.findUnique({
            where: { ID: id },
        })

        if (!company) return null
        return CompanyMapper.fromPersistence(company)
    }

    async findByName(name: string): Promise<Company | null> {
        const company = await prisma.empresa.findFirst({
            where: {
                NOME: {
                    equals: name,
                    mode: 'insensitive',
                },
            },
        })

        if (!company) return null
        return CompanyMapper.fromPersistence(company)
    }

    async findAll(): Promise<Company[]> {
        const companies = await prisma.empresa.findMany({
            select: {
                ID: true,
                NOME: true,
                APELIDO: true,
            },
        })

        return companies.map(company => CompanyMapper.fromPersistence(company))
    }

    async getTagTypes(companyId: number): Promise<string[]> {
        const tags = await prisma.eTIQUETAS.findMany({
            where: {
                EMPRESA_ID: companyId,
            },
            select: {
                TipoEtiqueta: true,
            },
        })

        const uniqueTagTypes = [...new Set(tags.map(tag => tag.TipoEtiqueta).filter(Boolean))]
        return uniqueTagTypes as string[]
    }

    async save(company: Company): Promise<Company> {
        const data = CompanyMapper.toPersistence(company)

        const saved = await prisma.empresa.upsert({
            where: { ID: company.id },
            update: {
                NOME: data.NOME,
                APELIDO: data.APELIDO,
            },
            create: {
                ID: data.ID,
                NOME: data.NOME,
                APELIDO: data.APELIDO,
            },
        })

        return CompanyMapper.fromPersistence(saved)
    }
}
