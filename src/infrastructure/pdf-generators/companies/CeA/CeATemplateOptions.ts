export class CeATemplateOptions {
    getProductKey(): string {
        return 'PRODUCTS'
    }

    normalizeProduct(product: { MOD?: string; COD?: string; CAB?: string }): Record<string, any> {
        return {
            MOD: product.MOD || '',
            COD: product.COD || '',
            CAB: product.CAB || '',
        }
    }
}
