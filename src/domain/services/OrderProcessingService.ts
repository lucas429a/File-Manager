import { Order } from '../entities/Order'

export class OrderProcessingService {
    public canProcessOrder(order: Order): { canProcess: boolean; reason?: string } {
        if (order.isProcessing()) {
            return {
                canProcess: false,
                reason: 'Order is already being processed',
            }
        }

        if (order.isCompleted()) {
            return {
                canProcess: false,
                reason: 'Order has already been processed',
            }
        }

        return { canProcess: true }
    }

    public calculateTagCount(tags: any[]): number {
        return tags.length
    }

    public validateOrderData(orderNumber: string, companyId: number): { isValid: boolean; errors: string[] } {
        const errors: string[] = []

        if (!orderNumber || orderNumber.trim().length === 0) {
            errors.push('Order number is required')
        }

        if (!companyId || companyId <= 0) {
            errors.push('Company ID is required and must be positive')
        }

        return {
            isValid: errors.length === 0,
            errors,
        }
    }
}
