import { GeneratePDFInputDTO, GeneratePDFOutputDTO } from '../dto/GeneratePDFDTO'

export interface IPDFGenerator {
    generate(outputFileName: string, data: any[], quantity?: number): Promise<Buffer>
}

export interface IPDFGeneratorFactory {
    getGenerator(config: { typeTag: string; codeCompany: number }): IPDFGenerator
}

export interface ITagsService {
    getTagsByType(companyCode: number, tagType: string, orderNumber?: string): Promise<any[]>
    getTagsByIds(ids: string[], companyCode?: number, tagType?: string): Promise<any[]>
    getTagById(id: string): Promise<any | null>
}

export class GeneratePDF {
    private static readonly tagsPerPage: Record<string, Record<string, number>> = {
        1758846: { corrugado: 1, frontbox: 2, palmilha: 1, calcentertag: 2 },
        1742590: { price: 1, volume: 1, sku: 1 },
        1756059: { pricebesni: 2 },
        1757040: { pricedigaspi: 2 },
        1742619: { pack: 1, skuprice: 1, pricedisantinni: 2 },
        1760014: { avenidaprice: 2, avenidapack: 1, avenidainsole: 2 },
        1758860: { torratag: 2 },
        1760026: { humanitarian: 2 },
        1758780: { pernambucanastag: 2 },
        3132717: { lfvolume: 3, lfprice: 3 },
        1756084: { caeduvolume: 1, caeduprice: 2, caedunoprice: 2 },
        1758779: { ceaprice: 1, ceapack: 1 },
    }

    constructor(
        private readonly pdfGeneratorFactory: IPDFGeneratorFactory,
        private readonly tagsService: ITagsService
    ) {}

    async execute(input: GeneratePDFInputDTO): Promise<GeneratePDFOutputDTO> {
        const { companyCode, tagType, orderNumber, quantity, sizesWithQuantities } = input

        if (!companyCode || !tagType) {
            return {
                success: false,
                error: 'Parameters companyCode and tagType are required',
            }
        }

        try {
            let data: any[]

            if (sizesWithQuantities && sizesWithQuantities.length > 0) {
                data = await this.getTagsWithQuantities(companyCode, tagType, orderNumber, sizesWithQuantities)
            } else if (quantity && quantity > 0) {
                const allData = await this.tagsService.getTagsByType(companyCode, tagType, orderNumber)
                const tagsPerPage = this.getTagsPerPage(companyCode, tagType)
                const requiredInputs = this.calculateRequiredInputs(quantity, tagsPerPage)
                data = this.expandTagsByQuantity(allData, requiredInputs)
            } else {
                data = await this.tagsService.getTagsByType(companyCode, tagType, orderNumber)
            }

            const generator = this.pdfGeneratorFactory.getGenerator({ typeTag: tagType, codeCompany: companyCode })
            const outputFileName = `${companyCode}_${tagType}_${Date.now()}.pdf`
            const buffer = await generator.generate(outputFileName, data)

            return {
                success: true,
                buffer,
                fileName: outputFileName,
            }
        } catch (error: any) {
            return {
                success: false,
                error: error.message,
            }
        }
    }

    private getTagsPerPage(companyCode: number, typeTag: string): number {
        const normalizedTag = typeTag.trim().toLowerCase()
        return GeneratePDF.tagsPerPage[companyCode]?.[normalizedTag] || 1
    }

    private calculateRequiredInputs(quantity: number, tagsPerPage: number): number {
        if (!quantity || quantity <= 0) return 0
        return Math.ceil(quantity / tagsPerPage)
    }

    private expandTagsByQuantity(data: any[], requiredInputs: number): any[] {
        if (requiredInputs <= 0 || data.length === 0) return data
        if (data.length >= requiredInputs) return data.slice(0, requiredInputs)

        const expandedData: any[] = []
        let index = 0
        while (expandedData.length < requiredInputs) {
            expandedData.push(data[index % data.length])
            index++
        }
        return expandedData
    }

    private async getTagsWithQuantities(
        companyCode: number,
        tagType: string,
        orderNumber: string | undefined,
        sizesWithQuantities: Array<{ id: string; quantity: number }>
    ): Promise<any[]> {
        const result: any[] = []
        const tagsPerPage = this.getTagsPerPage(companyCode, tagType)

        for (const item of sizesWithQuantities) {
            const tags = await this.tagsService.getTagsByIds([item.id])
            if (tags.length > 0) {
                const requiredInputs = this.calculateRequiredInputs(item.quantity, tagsPerPage)
                const expandedTags = this.expandTagsByQuantity(tags, requiredInputs)
                result.push(...expandedTags)
            }
        }

        return result
    }
}
