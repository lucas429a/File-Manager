import { Tag, TagProps } from '../entities/Tag'

export interface FindTagsFilter {
    companyId?: number
    orderNumber?: string
    tagType?: string
    color?: string
    size?: string
    model?: string
}

export interface ITagRepository {
    save(tag: Tag): Promise<Tag>
    saveMany(tags: Tag[]): Promise<Tag[]>
    findById(id: string): Promise<Tag | null>
    findByOrder(orderNumber: string, companyId: number): Promise<Tag[]>
    findByCompany(companyId: number): Promise<Tag[]>
    findByType(companyId: number, tagType: string, orderNumber?: string): Promise<Tag[]>
    findWithFilter(filter: FindTagsFilter): Promise<Tag[]>
    delete(id: string): Promise<void>
    deleteByOrder(orderNumber: string, companyId: number): Promise<number>
    count(filter: FindTagsFilter): Promise<number>
}
