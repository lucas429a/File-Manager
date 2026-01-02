import fs from 'fs'
import path from 'path'
import { PernambucanasTagFonts } from '../../../../fonts/Pernambucanas/PernambucanasTag.Fonts'
import { IPDFGenerator } from '../../../factories/PDFGeneratorFactory'
import { PernambucanasTagData } from '../../../converters/companies/Pernambucanas/PernambucanasTagConverter'
import { PernambucanasTagTemplate } from '../../templates/companies/Pernambucanas/PernambucanasTag.Template'
import { fakeLogo } from '../../../../logos/logo'
import { generate } from '@pdfme/generator'
import { barcodes, image, multiVariableText, text } from '@pdfme/schemas'

const fontLoader = new PernambucanasTagFonts()
const font = fontLoader.getAllFonts()

const TemplateLoader = new PernambucanasTagTemplate()
const template = TemplateLoader.getTemplate()

export class PernambucanasTagPDF implements IPDFGenerator {
    private formatArticle(codigo: string): string {
        const digits = codigo.replace(/\D/g, '')
        const part1 = digits.slice(0, 6)
        const part2 = digits.slice(6, 8)
        const part3 = digits.slice(8, 10)
        const part4 = digits.slice(10, 12)
        const part5 = digits.slice(12, 13)

        return [part1, part2, part3, part4, part5].filter(Boolean).join('.')
    }

    private prepareInputs(data: PernambucanasTagData[]): any[] {
        return data.map(item => {
            const cleanEAN = item.ITEM ? item.ITEM.trim().replace(/\s+/g, '') : ''
            const article = item.ITEM ? this.formatArticle(item.ITEM) : ''

            return {
                Pedido1: 'Pedido',
                Pedido2: 'Pedido',
                Artigo1: 'Artigo',
                Artigo2: 'Artigo',
                CodBar1: `0${cleanEAN}`,
                CodBar2: `0${cleanEAN}`,
                img1: fakeLogo,
                img2: fakeLogo,
                N_PEDIDO1: JSON.stringify({ N_PEDIDO1: `${item.N_PEDIDO}.${item.FAIXA}` }),
                N_PEDIDO2: JSON.stringify({ N_PEDIDO2: `${item.N_PEDIDO}.${item.FAIXA}` }),
                ARTIGO1: JSON.stringify({ ARTIGO1: article }),
                ARTIGO2: JSON.stringify({ ARTIGO2: article }),
                DESCRICAO1: JSON.stringify({ DESCRICAO1: item.DESCRICAO.slice(0, 30) }),
                DESCRICAO2: JSON.stringify({ DESCRICAO2: item.DESCRICAO.slice(0, 30) }),
            }
        })
    }

    public async generate(outputFileName: string, data: PernambucanasTagData[]): Promise<Buffer> {
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
                    barcode: barcodes.code128,
                    text,
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
