import { Order, OrderStatus } from '../../domain/entities/Order'
import { OrderDTO } from '../dto/OrderDTO'

export class OrderMapper {
    public static toDTO(order: Order): OrderDTO {
        return {
            id: order.id,
            orderNumber: order.orderNumber,
            companyId: order.companyId,
            status: order.status,
            tagCount: order.tagCount,
            createdAt: order.createdAt,
        }
    }

    public static toDomain(dto: OrderDTO): Order {
        return Order.create({
            id: dto.id,
            orderNumber: dto.orderNumber,
            companyId: dto.companyId,
            status: dto.status as OrderStatus,
            tagCount: dto.tagCount,
            createdAt: dto.createdAt,
        })
    }

    public static toDTOList(orders: Order[]): OrderDTO[] {
        return orders.map(order => this.toDTO(order))
    }
}
