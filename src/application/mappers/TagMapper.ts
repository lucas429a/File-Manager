import { Tag, TagProps } from '../../domain/entities/Tag'
import { TagDTO } from '../dto/TagDTO'

export class TagMapper {
    public static toDTO(tag: Tag): TagDTO {
        return {
            id: tag.id,
            orderNumber: tag.orderNumber,
            companyId: tag.companyId,
            tagType: tag.tagType,
            description: tag.description,
            quantity: tag.quantity,
            size: tag.size,
            color: tag.color,
            price: tag.price,
        }
    }

    public static toDomain(dto: TagDTO): Tag {
        return Tag.create({
            id: dto.id,
            orderNumber: dto.orderNumber,
            companyId: dto.companyId,
            tagType: dto.tagType,
            description: dto.description,
            quantity: dto.quantity,
            size: dto.size,
            color: dto.color,
            price: dto.price,
        })
    }

    public static toPersistence(tag: Tag): Record<string, any> {
        return {
            N_PEDIDO: tag.orderNumber,
            EMPRESA_ID: tag.companyId,
            TipoEtiqueta: tag.tagType,
            DESCRICAO: tag.description,
            QTD: tag.quantity,
            N_TAMANHO: tag.size,
            COR: tag.color,
            PRECO_VDA: tag.price,
            EAN: tag.ean,
            SUBSEGMENTO: tag.subsegment,
            ITEM: tag.item,
            GRADE: tag.grade,
            VOLUME: tag.volume,
            CENTRO_FATURAMENTO: tag.billingCenter,
            QTD_TOTAL: tag.totalQuantity,
            FORNECEDOR: tag.supplier,
        }
    }

    public static fromPersistence(data: Record<string, any>): Tag {
        return Tag.restore({
            id: data.id,
            orderNumber: data.N_PEDIDO,
            companyId: data.EMPRESA_ID,
            tagType: data.TipoEtiqueta,
            description: data.DESCRICAO,
            quantity: data.QTD ? Number(data.QTD) : null,
            size: data.N_TAMANHO,
            color: data.COR,
            price: data.PRECO_VDA,
            ean: data.EAN,
            subsegment: data.SUBSEGMENTO,
            item: data.ITEM,
            grade: data.GRADE,
            volume: data.VOLUME,
            billingCenter: data.CENTRO_FATURAMENTO,
            totalQuantity: data.QTD_TOTAL,
            supplier: data.FORNECEDOR,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        })
    }

    public static toDTOList(tags: Tag[]): TagDTO[] {
        return tags.map(tag => this.toDTO(tag))
    }
}
