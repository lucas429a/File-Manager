import { ITagRepository } from '../../domain/repositories/ITagRepository'
import { TagMapper } from '../mappers/TagMapper'
import { TagListInputDTO, TagListOutputDTO, DeleteTagsInputDTO, DeleteTagsOutputDTO } from '../dto/TagDTO'

export class GetTags {
    constructor(private readonly tagRepository: ITagRepository) {}

    async execute(input: TagListInputDTO): Promise<TagListOutputDTO> {
        const { companyCode, orderNumber, tagType, color, model } = input

        try {
            const tags = await this.tagRepository.findWithFilter({
                companyId: companyCode,
                orderNumber,
                tagType,
                color,
                model,
            })

            return {
                tags: TagMapper.toDTOList(tags),
            }
        } catch (error: any) {
            throw new Error(`Error to find tags: ${error.message}`)
        }
    }
}

export class DeleteTags {
    constructor(private readonly tagRepository: ITagRepository) {}

    async execute(input: DeleteTagsInputDTO): Promise<DeleteTagsOutputDTO> {
        const { orderNumber, companyId } = input

        try {
            const deletedCount = await this.tagRepository.deleteByOrder(orderNumber, companyId)

            return {
                success: true,
                deletedCount,
            }
        } catch (error: any) {
            throw new Error(`Failed to delete tags: ${error.message}`)
        }
    }
}
