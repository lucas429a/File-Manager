import path from 'path'
import fs from 'fs'
import { IPDFGenerator } from '../../../factories/PDFGeneratorFactory'
import { onlyDigits } from '../../../../shared/utils/formatNumbers'
import { DiSantiniPriceSkuData } from '../../../converters/companies/DiSantini/DiSantiniPriceSkuConverter'
import { DiSantinniSKUFonts } from '../../../../fonts/DiSantinni/DiSantinniSKU.Fonts'
import { generate } from '@pdfme/generator'
import { barcodes, multiVariableText, text } from '@pdfme/schemas'
import { DiSantinniSKUTemplate } from '../../templates/companies/DiSantinni/DiSantiSKU.Template'

const fontLoader = new DiSantinniSKUFonts()
const font = fontLoader.getAllFonts()

const TemplateLoader = new DiSantinniSKUTemplate()
const template = TemplateLoader.getTemplate()

export class DiSantinniSKUPDF implements IPDFGenerator {
    private prepareInputs(data: DiSantiniPriceSkuData[]): any[] {
        return data.map(item => {
            const skuCode = onlyDigits(item.codigoSku)
            const formattedSize = item.tamanho.replace(/^0+/, '')
            const getFirstWord = (text: string): string => {
                return text.trim().split(/\s+/)[0]
            }
            return {
                UC: JSON.stringify({ UC: getFirstWord(item.uc) }),
                CODIGO_DIGITO: JSON.stringify({ CODIGO_DIGITO: item.codigoSku }),
                DESCRICAO: JSON.stringify({ DESCRICAO: item.descricao.slice(0, 20) }),
                COR: JSON.stringify({ COR: item.cor.slice(0, 15) }),
                N_TAMANHO: JSON.stringify({ N_TAMANHO: formattedSize }),
                N_PRECO: JSON.stringify({ N_PRECO: item.preco }),
                ITEM: JSON.stringify({ ITEM: item.codigoSku }),
                PRECO_VDA: JSON.stringify({ PRECO_VDA: item.preco }),
                codBarra: skuCode,
                qrCode: skuCode,
                SKU: 'SKU:',
                REF: 'REF:',
                'COR:': 'COR:',
            }
        })
    }

    public async generate(outputFileName: string, data: DiSantiniPriceSkuData[]): Promise<Buffer> {
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
                    barcode: barcodes.code128,
                    qrCode: barcodes.qrcode,
                    multiVariableText,
                    text,
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
