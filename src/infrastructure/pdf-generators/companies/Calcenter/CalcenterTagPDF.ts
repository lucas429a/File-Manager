import path from 'path'
import fs from 'fs'

import { CalcenterFrontBoxFonts } from '../../../../fonts/calcenter/CalcenterFrontBox.Fonts'
import { IPDFGenerator } from '../../../factories/PDFGeneratorFactory'
import { CalcenterTagTemplate } from '../../templates/companies/Calcenter/CalcenterTag.Template'
import { generate } from '@pdfme/generator'
import { multiVariableText, svg, rectangle, barcodes, image } from '@pdfme/schemas'
import { fakeLogo } from '../../../../logos/logo'

export interface CalcenterTagData {
    QTD: string
    COR: string
    'N TAMANHO': string
    'CODIGO DIGITO': string
    DESCRICAO: string
    EAN: string
    'CODIGO MATERIAL SKU': string
}

const templateLoader = new CalcenterTagTemplate()
const template = templateLoader.getTemplate()

const fontLoader = new CalcenterFrontBoxFonts()
const font = fontLoader.getAllFonts()

export class CalcenterTagPDF implements IPDFGenerator {
    private prepareInputs(data: CalcenterTagData[]): any[] {
        return data.map(item => ({
            STZ: 'STZ',
            'N TAMANHO': JSON.stringify({ 'N TAMANHO': item['N TAMANHO'] }),
            'N TAMANHO2': JSON.stringify({ 'N TAMANHO2': item['N TAMANHO'] }),
            'CODIGO DIGITO': JSON.stringify({ 'CODIGO DIGITO': item['CODIGO DIGITO'] }),
            'CODIGO DIGITO2': JSON.stringify({ 'CODIGO DIGITO2': item['CODIGO DIGITO'] }),
            'CODIGO MATERIAL SKU': JSON.stringify({ 'CODIGO MATERIAL SKU': item['CODIGO MATERIAL SKU'] }),
            'CODIGO MATERIAL SKU2': JSON.stringify({ 'CODIGO MATERIAL SKU2': item['CODIGO MATERIAL SKU'] }),
            DESCRICAO: JSON.stringify({ DESCRICAO: item.DESCRICAO }),
            DESCRICAO2: JSON.stringify({ DESCRICAO2: item.DESCRICAO }),
            EAN: JSON.stringify({ EAN: item.EAN }),
            EAN2: JSON.stringify({ EAN2: item.EAN }),
            QTD: JSON.stringify({ QTD: item.QTD }),
            QTD2: JSON.stringify({ QTD2: item.QTD }),
            COR: JSON.stringify({ COR: item.COR }),
            COR2: JSON.stringify({ COR2: item.COR }),
            BARCODE: item.EAN,
            BARCODE2: item.EAN,
            svg: fakeLogo,
            svg2: fakeLogo,
        }))
    }

    public async generate(outputFileName: string, data: CalcenterTagData[]): Promise<Buffer> {
        const inputs = this.prepareInputs(data)
        const uploadsDir = path.resolve(__dirname, '../../../../uploads')

        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true })
        }

        const filePath = path.join(uploadsDir, outputFileName)

        try {
            const pdf = await generate({
                template,
                inputs,
                plugins: {
                    image,
                    svg,
                    rectangle,
                    barcode: barcodes.ean13,
                    multiVariableText,
                },
                options: { font: font as any },
            })
            fs.writeFileSync(filePath, pdf)
            return Buffer.from(pdf)
        } catch (error) {
            console.error('Error generating PDF:', error)
            throw new Error('Failed to generate PDF: ' + (error as Error).message)
        }
    }
}
