export interface IPDFGenerator<TData = any> {
    generate(outputFileName: string, data: TData[], quantity?: number): Promise<Buffer>
}

export abstract class PDFGeneratorBase<TData = any> implements IPDFGenerator<TData> {
    abstract generate(outputFileName: string, data: TData[], quantity?: number): Promise<Buffer>

    protected getTagsPerPage(): number {
        return 1
    }

    protected calculateRequiredInputs(quantity: number): number {
        const tagsPerPage = this.getTagsPerPage()
        if (!quantity || quantity <= 0) return 0
        return Math.ceil(quantity / tagsPerPage)
    }

    protected expandDataByQuantity(data: TData[], requiredInputs: number): TData[] {
        if (requiredInputs <= 0 || data.length === 0) return data
        if (data.length >= requiredInputs) return data.slice(0, requiredInputs)

        const expandedData: TData[] = []
        let index = 0
        while (expandedData.length < requiredInputs) {
            expandedData.push(data[index % data.length])
            index++
        }
        return expandedData
    }
}
