import path from 'path'
import fs from 'fs'
import { IPDFGenerator } from '../../../factories/PDFGeneratorFactory'
import { AvenidaTagData } from '../../../converters/companies/Avenida/AvenidaTagConverter'
import { PDFDocument } from 'pdf-lib'
import { barcodes, multiVariableText, text } from '@pdfme/schemas'
import { generate } from '@pdfme/generator'

import { AvenidaInsoleHeaderTemplate } from '../../templates/companies/Avenida/AvenidaInsoleHeader.Template'
import { AvenidaInsoleTemplate } from '../../templates/companies/Avenida/AvenidaInsole.Template'
import { AvenidaPackFonts } from '../../../../fonts/Avenida/AvenidaPack.Fonts'

const fontLoader = new AvenidaPackFonts()
const font = fontLoader.getAllFonts()

const priceTemplateLoader = new AvenidaInsoleTemplate()
const priceTemplate = priceTemplateLoader.getTemplate()

const headerTemplateLoader = new AvenidaInsoleHeaderTemplate()
const headerTemplate = headerTemplateLoader.getTemplate()

export class AvenidaInsolePDF implements IPDFGenerator {
    private preparePriceInputs(data: AvenidaTagData[]): any[] {
        return data.map(item => {
            return {
                BARCODE: item.COD_BARRA,
                BARCODE2: item.COD_BARRA,
            }
        })
    }

    private prepareHeaderInputs(item: AvenidaTagData) {
        return [
            {
                TAM: 'TAM:',
                TAM2: 'TAM:',
                UC: JSON.stringify({ UC: item.UC }),
                UC2: JSON.stringify({ UC2: item.UC }),
                DESCRICAO: JSON.stringify({ DESCRICAO: item.DESCRICAO }),
                DESCRICAO2: JSON.stringify({ DESCRICAO2: item.DESCRICAO }),
                N_TAMANHO: JSON.stringify({ N_TAMANHO: item.N_TAMANHO }),
                N_TAMANHO2: JSON.stringify({ N_TAMANHO2: item.N_TAMANHO }),
            },
        ]
    }

    private groupByTamanho(data: AvenidaTagData[]) {
        return data.reduce((groups, item) => {
            const key = item.N_TAMANHO || ''
            if (!groups[key]) {
                groups[key] = []
            }
            groups[key].push(item)
            return groups
        }, {} as Record<string, AvenidaTagData[]>)
    }

    public async generate(outputFileName: string, data: AvenidaTagData[], quantity?: number): Promise<Buffer> {
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
                const headerPdf = await generate({
                    template: headerTemplate,
                    inputs: headerInputs,
                    plugins: {
                        multiVariableText,
                        text,
                    },
                    options: {
                        font: font as any,
                    },
                })

                const priceInputs = this.preparePriceInputs(items)

                const pricePdf = await generate({
                    template: priceTemplate,
                    inputs: priceInputs,
                    plugins: {
                        multiVariableText,
                        text,
                        barcodes: barcodes.code128,
                    },
                    options: {
                        font: font as any,
                    },
                })

                const headerPdfDoc = await PDFDocument.load(headerPdf)
                const pricePdfDoc = await PDFDocument.load(pricePdf)

                const headerPages = await mergedPdfDoc.copyPages(headerPdfDoc, headerPdfDoc.getPageIndices())
                headerPages.forEach(page => mergedPdfDoc.addPage(page))

                const pricePages = await mergedPdfDoc.copyPages(pricePdfDoc, pricePdfDoc.getPageIndices())
                pricePages.forEach(page => mergedPdfDoc.addPage(page))
            }

            const mergedPdfBytes = await mergedPdfDoc.save()

            fs.writeFileSync(filePath, mergedPdfBytes)
            return Buffer.from(mergedPdfBytes)
        } catch (error: any) {
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                data: data,
            })
            throw error
        }
    }
}
