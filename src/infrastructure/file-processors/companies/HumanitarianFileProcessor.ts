import fs from 'fs'
import { ConverterFactory } from '../../factories/ConverterFactory'
import { FileProcessorBase } from '../base/FileProcessorBase'
import { TagDataService } from '../../services/data/TagDataService'

export class HumanitarianFileProcessor extends FileProcessorBase {
    private tagDataService = new TagDataService()

    async processFiles(files: Express.Multer.File[], companyCode: number) {
        const converter = ConverterFactory.getConverter({ typeTag: 'humanitarianTag', codeCompany: companyCode })

        const allConverted: any[] = []
        const orderNumbers: number[] = []

        for (const file of files) {
            const content = await fs.promises.readFile(file.path, 'utf8')
            const converted = converter.parse({ csvData: content })
            allConverted.push(...converted)

            converted.forEach((item: any) => {
                const orderNumber = Number(item.N_PEDIDO)
                if (!isNaN(orderNumber) && !orderNumbers.includes(orderNumber)) {
                    orderNumbers.push(orderNumber)
                }
            })
        }

        orderNumbers.sort((a, b) => a - b)
        const minOrder = orderNumbers[0]
        const maxOrder = orderNumbers[orderNumbers.length - 1]
        const orderRange = minOrder === maxOrder ? minOrder.toString() : `${minOrder}-${maxOrder}`

        const dataWithOrderRange = allConverted.map(obj => ({
            ...obj,
            N_PEDIDO: orderRange,
        }))

        const aggregated = this.aggregateHumanitarian(dataWithOrderRange)

        return await this.tagDataService.saveToTagsTable(aggregated, companyCode, 'humanitarian')
    }

    async organizeFiles(files: Express.Multer.File[]) {
        if (!files || files.length === 0) {
            throw new Error('Not found files for Humanitarian processing.')
        }
        return { files }
    }

    private aggregateHumanitarian(data: any[]): any[] {
        const grouped: Record<string, any> = {}

        for (const obj of data) {
            const key = [obj.EAN, obj.DESCRICAO, obj.FORNECEDOR, obj.COR, obj.N_TAMANHO].join('|')

            if (!grouped[key]) {
                grouped[key] = {
                    ...obj,
                    QTD: Number(obj.QTD),
                }
            } else {
                grouped[key].QTD += Number(obj.QTD)
            }
        }

        return Object.values(grouped).map(obj => ({
            ...obj,
            QTD: String(obj.QTD).padStart(6, '0'),
        }))
    }
}
