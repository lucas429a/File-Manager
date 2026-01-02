export interface ITemplateOptionsSchema {
    getProductKey(): string
    normalizeProduct(producty: any): Record<string, any>
}

export class TorraTemplateOptions implements ITemplateOptionsSchema {
    getProductKey(): string {
        return 'CODMOD'
    }

    normalizeProduct(product: any): Record<string, any> {
        return {
            CODMOD: product.CODMOD,
            MODCOR: product.MODCOR,
        }
    }
}
