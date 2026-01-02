import { ITagRepository } from '../../domain/repositories/ITagRepository'
import { OrderListOutputDTO } from '../dto/OrderDTO'

export interface GetOrdersByCompanyInput {
    companyCode: number
}

export class GetOrdersByCompany {
    constructor(private readonly tagRepository: ITagRepository) {}

    async execute(input: GetOrdersByCompanyInput): Promise<OrderListOutputDTO> {
        const { companyCode } = input

        if (!companyCode) {
            throw new Error('Company code is required.')
        }

        try {
            const tags = await this.tagRepository.findByCompany(companyCode)
            const uniqueOrderNumbers = [...new Set(tags.map(tag => tag.orderNumber))]

            if (uniqueOrderNumbers.length === 0) {
                throw new Error('No orders found for the company.')
            }

            return {
                orders: uniqueOrderNumbers,
            }
        } catch (error: any) {
            throw new Error(`Failed to fetch orders: ${error.message}`)
        }
    }
}
