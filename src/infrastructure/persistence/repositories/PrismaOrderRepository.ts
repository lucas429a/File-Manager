import { IOrderRepository } from '../../../domain/repositories/IOrderRepository'
import { Order, OrderStatus } from '../../../domain/entities/Order'
import prisma from '../prisma/client'

export class PrismaOrderRepository implements IOrderRepository {
    async findById(id: string): Promise<Order | null> {
        const tags = await prisma.eTIQUETAS.findMany({
            where: { id },
            take: 1,
        })

        if (tags.length === 0) return null

        return Order.restore({
            id,
            orderNumber: tags[0].N_PEDIDO || '',
            companyId: tags[0].EMPRESA_ID,
            status: 'completed' as OrderStatus,
        })
    }

    async findByNumber(orderNumber: string, companyId: number): Promise<Order | null> {
        const tags = await prisma.eTIQUETAS.findMany({
            where: {
                N_PEDIDO: orderNumber,
                EMPRESA_ID: companyId,
            },
            take: 1,
        })

        if (tags.length === 0) return null

        const tagCount = await prisma.eTIQUETAS.count({
            where: {
                N_PEDIDO: orderNumber,
                EMPRESA_ID: companyId,
            },
        })

        return Order.restore({
            orderNumber,
            companyId,
            status: 'completed' as OrderStatus,
            tagCount,
        })
    }

    async findByCompany(companyId: number): Promise<Order[]> {
        const tags = await prisma.eTIQUETAS.findMany({
            where: {
                EMPRESA_ID: companyId,
            },
            select: {
                N_PEDIDO: true,
            },
        })

        const uniqueOrderNumbers = [...new Set(tags.map(tag => tag.N_PEDIDO).filter(Boolean))]

        return uniqueOrderNumbers.map(orderNumber =>
            Order.restore({
                orderNumber: orderNumber as string,
                companyId,
                status: 'completed' as OrderStatus,
            })
        )
    }

    async save(order: Order): Promise<Order> {
        return order
    }

    async updateStatus(id: string, status: string): Promise<Order> {
        const order = await this.findById(id)
        if (!order) {
            throw new Error('Order not found')
        }
        return order
    }

    async getOrderNumbers(companyId: number): Promise<string[]> {
        const tags = await prisma.eTIQUETAS.findMany({
            where: {
                EMPRESA_ID: companyId,
            },
            select: {
                N_PEDIDO: true,
            },
        })

        const uniqueOrderNumbers = [...new Set(tags.map(tag => tag.N_PEDIDO).filter(Boolean))]
        return uniqueOrderNumbers as string[]
    }
}
