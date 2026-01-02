import { ITagRepository } from '../../domain/repositories/ITagRepository'

export interface GetTagTypesByCompanyInput {
    companyCode: number
    orderNumber?: string
}

export interface GetTagTypesByCompanyOutput {
    tagTypes: string[]
}

export class GetTagTypesByCompany {
    constructor(private readonly tagRepository: ITagRepository) {}

    async execute(input: GetTagTypesByCompanyInput): Promise<GetTagTypesByCompanyOutput> {
        const { companyCode, orderNumber } = input

        if (!companyCode) {
            throw new Error('Code company is required.')
        }

        try {
            const tags = await this.tagRepository.findByCompany(companyCode)

            let filteredTags = tags
            if (orderNumber) {
                filteredTags = tags.filter(tag => tag.orderNumber === orderNumber)
            }

            const uniqueTagTypes = [...new Set(filteredTags.map(tag => tag.tagType))]

            if (uniqueTagTypes.length === 0) {
                throw new Error('Nenhuma etiqueta encontrada para a empresa.')
            }

            return {
                tagTypes: uniqueTagTypes,
            }
        } catch (error: any) {
            throw new Error(`Failed to fetch tag types: ${error.message}`)
        }
    }
}
