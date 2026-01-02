import { generate } from '@pdfme/generator'
import { RiachueloSKUFonts } from '../../../../fonts/riachuelo/RiachueloSKU.Fonts'
import { IPDFGenerator } from '../../../factories/PDFGeneratorFactory'
import { RiachueloSKUTagData } from '../../../converters/companies/Riachuelo/RiachueloSKUTagConverter'
import { RiachueloSKUTemplate } from '../../templates/companies/Riachuelo/RiachueloSKU.Template'
import { RiachueloSKUHeaderTemplate } from '../../templates/companies/Riachuelo/RiachueloSKUHeader.Template'
import { barcodes, multiVariableText, text } from '@pdfme/schemas'
import path from 'path'
import fs from 'fs'
import { PDFDocument } from 'pdf-lib'

const fontLoader = new RiachueloSKUFonts()
const font = fontLoader.getAllFonts()

const skuTemplateLoader = new RiachueloSKUTemplate()
const skuTemplate = skuTemplateLoader.getTemplate()

const headerTemplateLoader = new RiachueloSKUHeaderTemplate()
const headerTemplate = headerTemplateLoader.getTemplate()

export class RiachueloSKUPDF implements IPDFGenerator {
    private format(value: number): string {
        return value.toString().padStart(4, '0')
    }

    private prepareSKUInputs(data: RiachueloSKUTagData[]): any[] {
        let globalIndex = 0
        return data.map(item => {
            const currentIndex = ++globalIndex
            const barcode = `2${parseInt(item.Grade, 10)}${item.Digito}${this.format(currentIndex)}`
            return {
                TAM: 'TAM:',
                COR: JSON.stringify({ COR: item.Cor }),
                DEPARTAMENTO: JSON.stringify({ DEPARTAMENTO: item.CodDepto }),
                DESCRICAO: JSON.stringify({ DESCRICAO: item.DescricaoMaterial }),
                N_TAMANHO: JSON.stringify({ N_TAMANHO: item.Tamanho }),
                CodBarra: barcode,
            }
        })
    }

    private prepareHeaderInputs(item: RiachueloSKUTagData) {
        return [
            {
                FORNECEDOR: 'FORNECEDOR : META INDUSTRIA D',
                MATERIAL: 'MATERIAL',
                ETIQUETA: 'ETIQUETA SKU',
                PEDIDO: 'PEDIDO :',
                GRADE: JSON.stringify({ GRADE: parseInt(item.Grade, 10) }),
                N_PEDIDO: JSON.stringify({ N_PEDIDO: item.PedidoCodigo }),
                ITEMPED: 'ITEM PED :',
            },
            {
                FORNECEDOR: 'FORNECEDOR : META INDUSTRIA D',
                MATERIAL: 'MATERIAL',
                ETIQUETA: 'ETIQUETA EXTERNA A CAIXA',
                PEDIDO: 'PEDIDO :',
                GRADE: JSON.stringify({ GRADE: parseInt(item.Grade, 10) }),
                N_PEDIDO: JSON.stringify({ N_PEDIDO: item.PedidoCodigo }),
                ITEMPED: 'ITEM PED :',
            },
        ]
    }

    private groupByTamanho(data: RiachueloSKUTagData[]) {
        return data.reduce((groups, item) => {
            const key = item.Tamanho || ''
            if (!groups[key]) {
                groups[key] = []
            }
            groups[key].push(item)
            return groups
        }, {} as Record<string, RiachueloSKUTagData[]>)
    }

    public async generate(outputFileName: string, data: RiachueloSKUTagData[], quantity?: number): Promise<Buffer> {
        const uploadsDir = path.resolve(__dirname, '../../../../uploads')
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true })
        }

        const filePath = path.join(uploadsDir, outputFileName)

        try {
            const groupedData = this.groupByTamanho(data)

            const mergedPdfDoc = await PDFDocument.create()

            for (const [tamanho, items] of Object.entries(groupedData)) {
                if (items.length === 0) continue

                const headerInputs = this.prepareHeaderInputs(items[0])
                for (const headerInput of headerInputs) {
                    const headerPdf = await generate({
                        template: headerTemplate,
                        inputs: [headerInput],
                        plugins: {
                            multiVariableText,
                            text,
                        },
                        options: {
                            font: font as any,
                        },
                    })

                    const headerPdfDoc = await PDFDocument.load(headerPdf)
                    const headerPages = await mergedPdfDoc.copyPages(headerPdfDoc, headerPdfDoc.getPageIndices())
                    headerPages.forEach(page => mergedPdfDoc.addPage(page))
                }

                const skuInputs = this.prepareSKUInputs(items)
                const skuPdf = await generate({
                    template: skuTemplate,
                    inputs: skuInputs,
                    plugins: {
                        multiVariableText,
                        text,
                        barCode: barcodes.code128,
                    },
                    options: { font: font as any },
                })

                const skuPdfDoc = await PDFDocument.load(skuPdf)
                const skuPages = await mergedPdfDoc.copyPages(skuPdfDoc, skuPdfDoc.getPageIndices())
                skuPages.forEach(page => mergedPdfDoc.addPage(page))
            }

            const mergedPdfBytes = await mergedPdfDoc.save()

            fs.writeFileSync(filePath, mergedPdfBytes)
            return Buffer.from(mergedPdfBytes)
        } catch (error) {
            console.error('Error to generate PDF:', error)
            throw new Error('Failed to generate PDF: ' + (error as Error).message)
        }
    }
}
