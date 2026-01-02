import { CaeduDynamicPDFGenerator } from '../pdf-generators/companies/Caedu/CaeduDynamicInsole'
import { CeADynamicPDFGenerator } from '../pdf-generators/companies/CeA/CeADynamicPDF'
import { PernambucanasDynamicPDFGenerator } from '../pdf-generators/companies/Pernambucanas/PernambucanasDynamicPDF'
import { TorraDynamicPDFGenerator } from '../pdf-generators/companies/Torra/TorraDynamicPDFGenerator'
import { ConverterFactory } from './ConverterFactory' 

export interface IDynamicPDFGenerator {
    generate(outputFileName: string, templateType: string, data: Record<string, any>[], quantity?: number): Promise<Buffer>
}

export class DynamicPDFGeneratorFactory {
    private static generators: Record<number, Record<string, new () => IDynamicPDFGenerator>> = {
        [ConverterFactory.torraCode]: {
            torradynamicinsole: TorraDynamicPDFGenerator,
        },
        [ConverterFactory.pernambucanasCode]: {
            pernambucanasdynamicinsole: PernambucanasDynamicPDFGenerator,
        },
        [ConverterFactory.caeduCode]: {
            caedudynamicinsole: CaeduDynamicPDFGenerator,
        },
        [ConverterFactory.ceaCode]: {
            ceadynamicinsole: CeADynamicPDFGenerator,
        },
    }

    static getGenerator({ template, companyCode }: { template: string; companyCode: number }): IDynamicPDFGenerator {
        const companyGenerators = this.generators[companyCode]

        if (!companyGenerators) {
            throw new Error('Generator not found for this company: ' + companyCode)
        }

        const GeneratorClass = companyGenerators[template.trim().toLowerCase()]

        if (!GeneratorClass) {
            throw new Error('Dynamic generator not found for template: ' + template)
        }

        return new GeneratorClass()
    }
}
