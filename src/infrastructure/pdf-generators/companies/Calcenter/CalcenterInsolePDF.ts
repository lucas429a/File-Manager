import path from 'path'
import { IPDFGenerator } from '../../../factories/PDFGeneratorFactory'
import { CSVDataInsole } from '../../../converters/companies/Calcenter/InsoleConverter'
import fs from 'fs'
import { CalcenterInsoleTemplate } from '../../templates/companies/Calcenter/CalcenterInsole.Template'
import { CalcenterInsoleFonts } from '../../../../fonts/calcenter/CalcenterInsole.Fonts'
import { barcodes, multiVariableText, text, line } from '@pdfme/schemas'
import { generate } from '@pdfme/generator'
import { CalcenterInsoleHeaderTemplate } from '../../templates/companies/Calcenter/CalcenterInsoleHeader.Template'
import { PDFDocument } from 'pdf-lib'

const templateLoader = new CalcenterInsoleTemplate()
const template = templateLoader.getTemplate()

const headerTemplateLoader = new CalcenterInsoleHeaderTemplate()
const headerTemplate = headerTemplateLoader.getTemplate()

const fontLoader = new CalcenterInsoleFonts()
const font = fontLoader.getAllFonts()

export class CalcenterInsolePDF implements IPDFGenerator {
    private prepareInputs(data: CSVDataInsole[]): any[] {
        return data.map(item => ({
            STZ: 'STZ',
            'N TAMANHO': JSON.stringify({ 'N TAMANHO': item['N TAMANHO'] }),
            'CODIGO MATERIAL SKU': JSON.stringify({ 'CODIGO MATERIAL SKU': item['CODIGO MATERIAL SKU'] }),
            DESCRICAO: JSON.stringify({ DESCRICAO: item.DESCRICAO }),
            QTD: JSON.stringify({ QTD: item.QTD }),
            COR: JSON.stringify({ COR: item.COR }),
            'CODIGO DIGITO': JSON.stringify({ 'CODIGO DIGITO': item['CODIGO DIGITO'] }),
            BarEAN: item.EAN,
        }))
    }

    private prepareHeaderInputs(item: CSVDataInsole, quantity?: number) {
        const qtyValue = quantity !== undefined ? quantity.toString() : item.QTD
        return [
            {
                QUANTIDADE: 'QUANTIDADE:',
                CODIGO: 'COD. SKU:',
                TAMANHO: 'TAMANHO:',
                QTD: JSON.stringify({ QTD: qtyValue }),
                'CODIGO MATERIAL SKU': JSON.stringify({ 'CODIGO MATERIAL SKU': item['CODIGO MATERIAL SKU'] }),
                N_TAMANHO: JSON.stringify({ N_TAMANHO: item['N TAMANHO'] }),
            },
            {
                QUANTIDADE: 'QUANTIDADE:',
                CODIGO: 'COD. SKU:',
                TAMANHO: 'TAMANHO:',
                QTD: JSON.stringify({ QTD: qtyValue }),
                'CODIGO MATERIAL SKU': JSON.stringify({ 'CODIGO MATERIAL SKU': item['CODIGO MATERIAL SKU'] }),
                N_TAMANHO: JSON.stringify({ N_TAMANHO: item['N TAMANHO'] }),
            },
        ]
    }

    private groupByTamanho(data: CSVDataInsole[]) {
        return data.reduce((groups, item) => {
            const key = item['N TAMANHO'] || ''
            if (!groups[key]) {
                groups[key] = []
            }
            groups[key].push(item)
            return groups
        }, {} as Record<string, CSVDataInsole[]>)
    }

    public async generate(outputFileName: string, data: CSVDataInsole[], quantity?: number): Promise<Buffer> {
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

                const tagInputs = this.prepareInputs(items)
                const tagPdf = await generate({
                    template,
                    inputs: tagInputs,
                    plugins: { text, multiVariableText, barcode: barcodes.ean13 },
                    options: { font: font as any },
                })

                const tagPdfDoc = await PDFDocument.load(tagPdf)
                const tagPages = await mergedPdfDoc.copyPages(tagPdfDoc, tagPdfDoc.getPageIndices())
                tagPages.forEach(page => mergedPdfDoc.addPage(page))

                const headerInputs = this.prepareHeaderInputs(items[0], quantity)
                const headerPdf = await generate({
                    template: headerTemplate,
                    inputs: headerInputs,
                    plugins: {
                        multiVariableText,
                        text,
                        line,
                    },
                    options: {
                        font: font as any,
                    },
                })

                const headerPdfDoc = await PDFDocument.load(headerPdf)
                const headerPages = await mergedPdfDoc.copyPages(headerPdfDoc, headerPdfDoc.getPageIndices())
                headerPages.forEach(page => mergedPdfDoc.addPage(page))
            }

            const mergedPdfBytes = await mergedPdfDoc.save()
            fs.writeFileSync(filePath, mergedPdfBytes)
            return Buffer.from(mergedPdfBytes)
        } catch (error) {
            console.error('Error on generate PDF:', error)
            throw new Error('Failed to generate PDF: ' + (error as Error).message)
        }
    }
}
