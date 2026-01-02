import fs from 'fs'
import path from 'path'
import { CSVDataFrontBox } from '../../../converters/companies/Calcenter/FrontBoxConverter'
import { generate } from '@pdfme/generator'
import { multiVariableText, text, barcodes, line } from '@pdfme/schemas'
import { CalcenterFrontBoxTemplate } from '../../templates/companies/Calcenter/CalcenterFrontBox.Template'
import { CalcenterFrontBoxFonts } from '../../../../fonts/calcenter/CalcenterFrontBox.Fonts'
import { IPDFGenerator } from '../../../factories/PDFGeneratorFactory'
import { CalcenterFrontBoxhHeaderTemplate } from '../../templates/companies/Calcenter/CalcenterFrontBoxhHeader.Template'
import { PDFDocument } from 'pdf-lib'

const templateLoader = new CalcenterFrontBoxTemplate()
const template = templateLoader.getTemplate()

const headerTemplateLoader = new CalcenterFrontBoxhHeaderTemplate()
const headerTemplate = headerTemplateLoader.getTemplate()

const fontLoader = new CalcenterFrontBoxFonts()
const font = fontLoader.getAllFonts()

export class CalcenterFrontBoxPDF implements IPDFGenerator {
    private prepareInputs(data: CSVDataFrontBox[]): any[] {
        return data.map(item => ({
            STZ: 'STZ',
            STZ2: 'STZ',
            'N TAMANHO': JSON.stringify({ 'N TAMANHO': item['N TAMANHO'] }),
            'N TAMANHO2': JSON.stringify({ 'N TAMANHO2': item['N TAMANHO'] }),
            'CODIGO DIGITO': JSON.stringify({ 'CODIGO DIGITO': item['CODIGO DIGITO'] }),
            'CODIGO DIGITO2': JSON.stringify({ 'CODIGO DIGITO2': item['CODIGO DIGITO'] }),
            'CODIGO MATERIAL SKU': JSON.stringify({ 'CODIGO MATERIAL SKU': item['CODIGO MATERIAL SKU'] }),
            'CODIGO MATERIAL SKU2': JSON.stringify({ 'CODIGO MATERIAL SKU2': item['CODIGO MATERIAL SKU'] }),
            'PRECO VDA': JSON.stringify({ 'PRECO VDA': item['PRECO VDA'] }),
            'PRECO VDA2': JSON.stringify({ 'PRECO VDA2': item['PRECO VDA'] }),
            'SEMANA ENTREGA': JSON.stringify({ 'SEMANA ENTREGA': item['SEMANA ENTREGA'] }),
            'SEMANA ENTREGA2': JSON.stringify({ 'SEMANA ENTREGA2': item['SEMANA ENTREGA'] }),
            DESCRICAO: JSON.stringify({ DESCRICAO: item.DESCRICAO }),
            DESCRICAO2: JSON.stringify({ DESCRICAO2: item.DESCRICAO }),
            EAN: JSON.stringify({ EAN: item.EAN }),
            EAN2: JSON.stringify({ EAN2: item.EAN }),
            QTD: JSON.stringify({ QTD: item.QTD }),
            QTD2: JSON.stringify({ QTD2: item.QTD }),
            COR: JSON.stringify({ COR: item.COR }),
            COR2: JSON.stringify({ COR2: item.COR }),
            FAIXA: JSON.stringify({ FAIXA: item.FAIXA }),
            FAIXA2: JSON.stringify({ FAIXA2: item.FAIXA }),
            ANO: JSON.stringify({ ANO: `/${item.ANO}` }),
            ANO2: JSON.stringify({ ANO2: `/${item.ANO}` }),
            PROMOCAO: JSON.stringify({ PROMOCAO: item.PROMOCAO }),
            PROMOCAO2: JSON.stringify({ PROMOCAO2: item.PROMOCAO }),
            ITEM: JSON.stringify({ ITEM: item.ITEM }),
            ITEM2: JSON.stringify({ ITEM2: item.ITEM }),
            SUBSEGMENTO: JSON.stringify({ SUBSEGMENTO: item.SUBSEGMENTO }),
            SUBSEGMENTO2: JSON.stringify({ SUBSEGMENTO2: item.SUBSEGMENTO }),
            CICLOVIDA: JSON.stringify({ CICLOVIDA: item.CICLOVIDA }),
            CICLOVIDA2: JSON.stringify({ CICLOVIDA2: item.CICLOVIDA }),
            BarEAN: item.EAN,
            BarEAN2: item.EAN,
        }))
    }

    private prepareHeaderInputs(item: CSVDataFrontBox, quantity?: number) {
        const qtyValue = quantity !== undefined ? quantity.toString() : item.QTD
        return [
            {
                'N° PEDIDO': 'COD. SKU:',
                'N° PEDIDO2': 'COD. SKU:',
                QUANTIDADE: 'QUANTIDADE:',
                QUANTIDADE2: 'QUANTIDADE:',
                TAMANHO: 'TAMANHO',
                TAMANHO2: 'TAMANHO',
                QTD: JSON.stringify({ QTD: qtyValue }),
                QTD2: JSON.stringify({ QTD2: qtyValue }),
                N_PEDIDO: JSON.stringify({ N_PEDIDO: item['CODIGO MATERIAL SKU'] }),
                N_PEDIDO2: JSON.stringify({ N_PEDIDO2: item['CODIGO MATERIAL SKU'] }),
                N_TAMANHO: JSON.stringify({ N_TAMANHO: item['N TAMANHO'] }),
                N_TAMANHO2: JSON.stringify({ N_TAMANHO2: item['N TAMANHO'] }),
            },
        ]
    }

    private groupByTamanho(data: CSVDataFrontBox[]) {
        return data.reduce((groups, item) => {
            const key = item['N TAMANHO'] || ''
            if (!groups[key]) {
                groups[key] = []
            }
            groups[key].push(item)
            return groups
        }, {} as Record<string, CSVDataFrontBox[]>)
    }

    public async generate(outputFileName: string, data: CSVDataFrontBox[], quantity?: number): Promise<Buffer> {
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
            console.error('Error to generate:', error)
            throw new Error('Failed to generate PDF: ' + (error as Error).message)
        }
    }
}
