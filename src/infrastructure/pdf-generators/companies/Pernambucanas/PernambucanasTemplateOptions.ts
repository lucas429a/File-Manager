import { ITemplateOptionsSchema } from '../Torra/TorraTemplateOptions'

export class PernambucanasTemplateOptions implements ITemplateOptionsSchema {
    getProductKey(): string {
        return 'ARTICLE'
    }

    normalizeProduct(product: any): Record<string, any> {
        return {
            ARTICLE: product.ARTICLE,
            MODCOR: product.MODCOR,
        }
    }
}
