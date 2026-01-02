import prisma from '../../prisma'
import { CaeduTemplateOptions } from '../pdf-generators/companies/Caedu/CaeduTemplateOption'
import { CeATemplateOptions } from '../pdf-generators/companies/CeA/CeATemplateOptions'
import { PernambucanasTemplateOptions } from '../pdf-generators/companies/Pernambucanas/PernambucanasTemplateOptions'
import { ITemplateOptionsSchema, TorraTemplateOptions } from '../pdf-generators/companies/Torra/TorraTemplateOptions'
import { DynamicPDFGeneratorFactory } from '../factories/DynamicPDFGeneratorFactory'

export class DynamicTagService {
    private templateOptionsMap: Record<string, ITemplateOptionsSchema> = {
        torradynamicinsole: new TorraTemplateOptions(),
        pernambucanasdynamicinsole: new PernambucanasTemplateOptions(),
        caeducynamicinsole: new CaeduTemplateOptions(),
        ceadynamicinsole: new CeATemplateOptions(),
    }

    private getTemplateOptions(template: string): ITemplateOptionsSchema {
        const normalizedTemplate = template.trim().toLocaleLowerCase()
        const options = this.templateOptionsMap[normalizedTemplate]

        if (!options) {
            throw new Error('Opções de template não encontradas para o template: ')
        }

        return options
    }

    async getDynamicTagOptions(companyCode: number, template: string) {
        const dynamicTag = await prisma.eTIQUETAS_DINAMICAS.findFirst({
            where: {
                EMPRESA_ID: companyCode,
                TEMPLATE: template,
            },
            select: {
                COMPLETE_OPTIONS: true,
            },
        })

        if (!dynamicTag?.COMPLETE_OPTIONS) {
            throw new Error(`Opções de etiqueta dinâmica não encontradas para a empresa ${companyCode} e template ${template}`)
        }

        return JSON.parse(dynamicTag.COMPLETE_OPTIONS.toString())
    }

    async generateDynamicPDF(companyCode: number, template: string, data: any, quantity: number = 1) {
        try {
            const multipliedData = Array(quantity)
                .fill(null)
                .flatMap(() => (Array.isArray(data) ? data : [data]))

            const generator = DynamicPDFGeneratorFactory.getGenerator({ template, companyCode })
            const fileName = `${companyCode}_${Date.now()}.pdf`

            const pdfBuffer = await generator.generate(fileName, template, multipliedData)

            return {
                success: true,
                buffer: pdfBuffer,
                fileName,
            }
        } catch (error) {
            throw new Error(`Erro ao gerar PDF dinâmico: ${error}`)
        }
    }

    async listDynamicTags(companyCode: number) {
        const tags = await prisma.eTIQUETAS_DINAMICAS.findMany({
            where: {
                EMPRESA_ID: companyCode,
            },
            select: {
                id: true,
                NOME: true,
                TEMPLATE: true,
                EMPRESA: {
                    select: {
                        NOME: true,
                    },
                },
            },
        })

        return tags
    }

    async addProductOption(companyCode: number, template: string, product: { CODMOD: number | string; MODCOR: string }) {
        if (!product || Object.keys(product).length === 0) {
            throw new Error('Produto inválido. Propriedades obrigatórias não fornecidas.')
        }

        const templateOptions = this.getTemplateOptions(template)
        const productkey = templateOptions.getProductKey()

        const dynamicTag = await prisma.eTIQUETAS_DINAMICAS.findFirst({
            where: {
                EMPRESA_ID: companyCode,
                TEMPLATE: template,
            },
        })

        if (!dynamicTag) {
            throw new Error(`Etiqueta dinâmica não encontrada para a empresa ${companyCode} e template ${template}`)
        }

        let options: any
        try {
            options = typeof dynamicTag.COMPLETE_OPTIONS === 'string' ? JSON.parse(dynamicTag.COMPLETE_OPTIONS) : dynamicTag.COMPLETE_OPTIONS ?? {}
        } catch (err) {
            throw new Error('Formato inválido em COMPLETE_OPTIONS: ' + (err as Error).message)
        }

        if (!options.products || !Array.isArray(options.products)) {
            options.products = []
        }

        const normalizedProduct = templateOptions.normalizeProduct(product)
        options.products.push(normalizedProduct)

        const updated = await prisma.eTIQUETAS_DINAMICAS.update({
            where: {
                id: dynamicTag.id,
            },
            data: {
                COMPLETE_OPTIONS: JSON.stringify(options),
            },
        })

        return { message: 'Produto adicionado com sucesso.' }
    }
}
