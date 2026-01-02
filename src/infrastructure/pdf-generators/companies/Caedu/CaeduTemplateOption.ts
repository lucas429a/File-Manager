import { ITemplateOptionsSchema } from '../Torra/TorraTemplateOptions'

export class CaeduTemplateOptions implements ITemplateOptionsSchema {
    getProductKey(): string {
        return 'suppliers'
    }

    normalizeProduct(product: { CODMOD?: number | string; MODCOR?: string; NAME?: string; CNPJ?: string }): Record<string, any> {
        return {
            NAME: product.NAME || '',
            CNPJ: product.CNPJ || '',
        }
    }
}
