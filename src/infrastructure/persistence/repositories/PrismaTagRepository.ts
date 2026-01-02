import { ITagRepository, FindTagsFilter } from '../../../domain/repositories/ITagRepository'
import { Tag } from '../../../domain/entities/Tag'
import { TagMapper } from '../../../application/mappers/TagMapper'
import prisma from '../prisma/client'

export class PrismaTagRepository implements ITagRepository {
    async save(tag: Tag): Promise<Tag> {
        const data = TagMapper.toPersistence(tag)

        const created = await prisma.eTIQUETAS.create({
            data: data as any,
        })

        return TagMapper.fromPersistence(created)
    }

    async saveMany(tags: Tag[]): Promise<Tag[]> {
        const savedTags: Tag[] = []

        for (const tag of tags) {
            const saved = await this.save(tag)
            savedTags.push(saved)
        }

        return savedTags
    }

    async findById(id: string): Promise<Tag | null> {
        const tag = await prisma.eTIQUETAS.findUnique({
            where: { id },
        })

        if (!tag) return null
        return TagMapper.fromPersistence(tag)
    }

    async findByOrder(orderNumber: string, companyId: number): Promise<Tag[]> {
        const tags = await prisma.eTIQUETAS.findMany({
            where: {
                N_PEDIDO: orderNumber,
                EMPRESA_ID: companyId,
            },
        })

        return tags.map(tag => TagMapper.fromPersistence(tag))
    }

    async findByCompany(companyId: number): Promise<Tag[]> {
        const tags = await prisma.eTIQUETAS.findMany({
            where: {
                EMPRESA_ID: companyId,
            },
        })

        return tags.map(tag => TagMapper.fromPersistence(tag))
    }

    async findByType(companyId: number, tagType: string, orderNumber?: string): Promise<Tag[]> {
        const whereClause: any = {
            EMPRESA_ID: companyId,
            TipoEtiqueta: {
                equals: tagType.trim(),
                mode: 'insensitive',
            },
        }

        if (orderNumber) {
            whereClause.N_PEDIDO = {
                equals: orderNumber.trim(),
                mode: 'insensitive',
            }
        }

        const tags = await prisma.eTIQUETAS.findMany({
            where: whereClause,
        })

        return tags.map(tag => TagMapper.fromPersistence(tag))
    }

    async findWithFilter(filter: FindTagsFilter): Promise<Tag[]> {
        const whereClause: any = {}

        if (filter.companyId) {
            whereClause.EMPRESA_ID = filter.companyId
        }

        if (filter.orderNumber) {
            whereClause.N_PEDIDO = {
                equals: filter.orderNumber.trim(),
                mode: 'insensitive',
            }
        }

        if (filter.tagType) {
            whereClause.TipoEtiqueta = {
                equals: filter.tagType.trim(),
                mode: 'insensitive',
            }
        }

        if (filter.color) {
            whereClause.COR = {
                contains: filter.color.trim(),
                mode: 'insensitive',
            }
        }

        if (filter.size) {
            whereClause.N_TAMANHO = {
                contains: filter.size.trim(),
                mode: 'insensitive',
            }
        }

        if (filter.model) {
            whereClause.DESCRICAO = {
                contains: filter.model.trim(),
                mode: 'insensitive',
            }
        }

        const tags = await prisma.eTIQUETAS.findMany({
            where: whereClause,
        })

        return tags.map(tag => TagMapper.fromPersistence(tag))
    }

    async delete(id: string): Promise<void> {
        await prisma.eTIQUETAS.delete({
            where: { id },
        })
    }

    async deleteByOrder(orderNumber: string, companyId: number): Promise<number> {
        const result = await prisma.eTIQUETAS.deleteMany({
            where: {
                N_PEDIDO: orderNumber,
                EMPRESA_ID: companyId,
            },
        })

        return result.count
    }

    async count(filter: FindTagsFilter): Promise<number> {
        const whereClause: any = {}

        if (filter.companyId) {
            whereClause.EMPRESA_ID = filter.companyId
        }

        if (filter.orderNumber) {
            whereClause.N_PEDIDO = filter.orderNumber
        }

        if (filter.tagType) {
            whereClause.TipoEtiqueta = filter.tagType
        }

        return await prisma.eTIQUETAS.count({
            where: whereClause,
        })
    }
}
