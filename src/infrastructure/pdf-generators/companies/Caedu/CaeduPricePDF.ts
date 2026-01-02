import fs from 'fs'
import path from 'path'

import { generate } from '@pdfme/generator'
import { CaeduFonts } from '../../../../fonts/Caedu/Caedu.Fonts'
import { IPDFGenerator } from '../../../factories/PDFGeneratorFactory'
import { CaeduPriceData } from '../../../converters/companies/Caedu/CaeduPriceConverter'
import { CaeduPriceTemplate } from '../../templates/companies/Caedu/CaeduPrice.Template'
import { barcodes, line, multiVariableText, text } from '@pdfme/schemas'

const fontLoader = new CaeduFonts()
const font = fontLoader.getAllFonts()

const TemplateLoader = new CaeduPriceTemplate()
const template = TemplateLoader.getTemplate()

export class CaeduPricePDF implements IPDFGenerator {
    private prepareInputs(data: CaeduPriceData[]): any[] {
        return data.map(item => {
            return {
                CAEDU1: 'CAEDU',
                CAEDU2: 'CAEDU',
                CORT1: 'COR:',
                CORT2: 'COR:',
                TAM1: 'TAM:',
                TAM2: 'TAM:',
                Produto: 'Produto',
                VolumeT: 'Volume',
                R$1: 'R$',
                R$2: 'R$',
                IF1: 'IF',
                IF2: 'IF',
                CODIGO_MATERIAL1: JSON.stringify({ CODIGO_MATERIAL1: item.CODIGO_MATERIAL_SKU }),
                CODIGO_MATERIAL2: JSON.stringify({ CODIGO_MATERIAL2: item.CODIGO_MATERIAL_SKU }),
                FAIXA1: JSON.stringify({ FAIXA1: item.FAIXA }),
                FAIXA2: JSON.stringify({ FAIXA2: item.FAIXA }),
                DEPARTAMENTO1: JSON.stringify({ DEPARTAMENTO1: item.DEPARTAMENTO }),
                DEPARTAMENTO2: JSON.stringify({ DEPARTAMENTO2: item.DEPARTAMENTO }),
                CICLOVIDA1: JSON.stringify({ CICLOVIDA1: this.formatData(item.CICLOVIDA) }),
                CICLOVIDA2: JSON.stringify({ CICLOVIDA2: this.formatData(item.CICLOVIDA) }),
                DESCRICAO1: JSON.stringify({ DESCRICAO1: item.DESCRICAO.slice(0, 33) }),
                DESCRICAO2: JSON.stringify({ DESCRICAO2: item.DESCRICAO.slice(0, 33) }),
                COR1: JSON.stringify({ COR1: item.COR }),
                COR2: JSON.stringify({ COR2: item.COR }),
                N_TAMANHO1: JSON.stringify({ N_TAMANHO1: item.N_TAMANHO }),
                N_TAMANHO2: JSON.stringify({ N_TAMANHO2: item.N_TAMANHO }),
                SUBSEGMENTO1: JSON.stringify({ SUBSEGMENTO1: item.SUBSEGMENTO }),
                SUBSEGMENTO2: JSON.stringify({ SUBSEGMENTO2: item.SUBSEGMENTO }),
                PRECO1: JSON.stringify({ PRECO1: item.PRECO_VDA }),
                PRECO2: JSON.stringify({ PRECO2: item.PRECO_VDA }),
                ITEM1: JSON.stringify({ ITEM1: item.ITEM }),
                ITEM2: JSON.stringify({ ITEM2: item.ITEM }),
                N_PEDIDO1: JSON.stringify({ N_PEDIDO1: item.N_PEDIDO }),
                N_PEDIDO2: JSON.stringify({ N_PEDIDO2: item.N_PEDIDO }),
                BARCODE1: item.CODIGO_MATERIAL_SKU,
                BARCODE2: item.CODIGO_MATERIAL_SKU,
            }
        })
    }

    public async generate(outputFileName: string, data: CaeduPriceData[], quantity?: number): Promise<Buffer> {
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
                    multiVariableText,
                    barcode: barcodes.code128,
                    text,
                    line,
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

    private formatData(data: string): string {
        const [day, mounth, year] = data.split('/')

        const formattedYear = year.slice(-2)

        return `${mounth}#${year}`
    }
}
