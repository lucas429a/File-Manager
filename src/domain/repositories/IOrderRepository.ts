import { Order } from '../entities/Order'

export interface IOrderRepository {
    findById(id: string): Promise<Order | null>
    findByNumber(orderNumber: string, companyId: number): Promise<Order | null>
    findByCompany(companyId: number): Promise<Order[]>
    save(order: Order): Promise<Order>
    updateStatus(id: string, status: string): Promise<Order>
    getOrderNumbers(companyId: number): Promise<string[]>
}
